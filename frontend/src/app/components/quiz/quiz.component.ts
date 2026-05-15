import {
  Component, OnInit, OnDestroy,
  signal, computed,
  AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService }  from '../../services/quiz.service';
import {
  Question, Answer, SessionResult,
  GlobalStats, StressTypeCount, AppState
} from '../../models/quiz.model';
import {
  Chart, ArcElement, DoughnutController,
  Tooltip, Legend
} from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

const ANSWER_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

const CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  E: { label: 'Emotional',        color: '#E8614F', icon: '💛' },
  P: { label: 'Physical',         color: '#2D8C6A', icon: '💪' },
  M: { label: 'Mental/Cognitive', color: '#2D3A8C', icon: '🧠' }
};

@Component({
  selector:     'app-quiz',
  standalone:   true,
  imports:      [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls:   ['./quiz.component.css']
})
export class QuizComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  // ── State signals ──────────────────────────────────────────────────────────
  appState       = signal<AppState>('disclaimer');
  questions      = signal<Question[]>([]);
  currentIndex   = signal(0);
  sessionId      = signal('');
  result         = signal<SessionResult | null>(null);
  stats          = signal<GlobalStats | null>(null);
  distribution   = signal<StressTypeCount[]>([]);
  errorMessage   = signal('');

  answers: Answer[] = [];
  private chart: Chart | null = null;

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly progressPct = computed(() => {
    const total = this.questions().length;
    return total === 0 ? 0 : Math.round((this.currentIndex() / total) * 100);
  });

  readonly currentQuestion = computed<Question | null>(() =>
    this.questions()[this.currentIndex()] ?? null
  );

  readonly categoryMeta = computed(() =>
    CATEGORY_META[this.currentQuestion()?.category ?? 'E']
  );

  readonly answerLabels = ANSWER_LABELS;

  constructor(private quizService: QuizService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Chart rendered imperatively after results appear
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  // ── User actions ───────────────────────────────────────────────────────────

  acceptDisclaimer(): void {
    this.appState.set('loading');
    this.quizService.getRandomQuestions().subscribe({
      next: (res) => {
        this.questions.set(res.questions);
        this.quizService.createSession(res.questions.map(q => q._id)).subscribe({
          next:  (sess) => { this.sessionId.set(sess.sessionId); this.appState.set('quiz'); },
          error: ()     => this.fail('Failed to initialise session. Is the backend running?')
        });
      },
      error: () => this.fail('Failed to load questions. Is the backend running on port 5000?')
    });
  }

  handleAnswer(rawValue: number): void {
    const q = this.currentQuestion();
    if (!q) return;

    this.answers.push({
      questionId: q._id,
      category:   q.category,
      reverse:    q.reverse,
      rawValue
    });

    const next = this.currentIndex() + 1;
    if (next < this.questions().length) {
      this.currentIndex.set(next);
    } else {
      this.submitSession();
    }
  }

  private submitSession(): void {
    this.appState.set('submitting');
    this.quizService.submitAnswers(this.sessionId(), this.answers).subscribe({
      next: (res) => {
        this.result.set(res.result);
        this.appState.set('results');
        this.fetchStats();
        // Give Angular a tick to render the canvas before drawing
        setTimeout(() => this.renderChart(), 120);
      },
      error: () => this.fail('Failed to submit answers. Please try again.')
    });
  }

  private fetchStats(): void {
    this.quizService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.stats);
        this.distribution.set(res.stressTypeDistribution);
      },
      error: () => {} // Non-critical — stats panel just stays hidden
    });
  }

  private renderChart(): void {
    const canvas = this.chartCanvasRef?.nativeElement;
    const r      = this.result();
    if (!canvas || !r) return;

    this.chart?.destroy();

    const pct = r.percentage;

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [pct, 100 - pct],
          backgroundColor: [
            pct < 25  ? '#2D8C6A' :
            pct < 50  ? '#F59E0B' :
            pct < 75  ? '#E8614F' : '#991B1B',
            '#EDE9E0'
          ],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '82%',
        plugins:  { tooltip: { enabled: false }, legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
        animation: { animateRotate: true, duration: 900 }
      }
    });
  }

  restart(): void {
    this.chart?.destroy();
    this.chart = null;
    this.answers = [];
    this.questions.set([]);
    this.currentIndex.set(0);
    this.sessionId.set('');
    this.result.set(null);
    this.stats.set(null);
    this.distribution.set([]);
    this.errorMessage.set('');
    this.appState.set('disclaimer');
  }

  private fail(msg: string): void {
    this.errorMessage.set(msg);
    this.appState.set('error');
  }

  // ── Template helpers ───────────────────────────────────────────────────────

  getCategoryLabel(cat: string): string {
    return CATEGORY_META[cat]?.label ?? cat;
  }

  getStressColorClass(pct: number): string {
    if (pct < 25)  return 'stress--low';
    if (pct < 50)  return 'stress--mild';
    if (pct < 75)  return 'stress--high';
    return                'stress--severe';
  }

  round(n: number): number { return Math.round(n); }
}
