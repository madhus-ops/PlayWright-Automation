import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type ExtentReporterOptions = {
  outputFile?: string;
  title?: string;
};

type TestRecord = {
  attachments: {
    contentType: string;
    name: string;
    path?: string;
  }[];
  duration: number;
  error?: string;
  file: string;
  location: string;
  projectName: string;
  retry: number;
  status: TestResult['status'];
  steps: string[];
  title: string;
};

export default class ExtentReporter implements Reporter {
  private readonly outputFile: string;
  private readonly title: string;
  private records: TestRecord[] = [];
  private startedAt = new Date();
  private totalTests = 0;

  constructor(options: ExtentReporterOptions = {}) {
    this.outputFile = options.outputFile ?? 'extent-report/index.html';
    this.title = options.title ?? 'Playwright Extent Report';
  }

  onBegin(_config: FullConfig, suite: Suite): void {
    this.startedAt = new Date();
    this.totalTests = suite.allTests().length;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.records.push({
      attachments: result.attachments.map((attachment) => ({
        contentType: attachment.contentType,
        name: attachment.name,
        path: attachment.path,
      })),
      duration: result.duration,
      error: result.error?.message,
      file: test.location.file,
      location: `${test.location.file}:${test.location.line}:${test.location.column}`,
      projectName: test.parent.project()?.name ?? 'default',
      retry: result.retry,
      status: result.status,
      steps: result.steps.map((step) => step.title),
      title: test.titlePath().slice(1).join(' > '),
    });
  }

  async onEnd(result: FullResult): Promise<void> {
    const reportPath = path.resolve(this.outputFile);
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, this.renderReport(result, reportPath), 'utf-8');
    console.log(`Extent report generated: ${reportPath}`);
  }

  private renderReport(result: FullResult, reportPath: string): string {
    const counts = this.records.reduce(
      (summary, record) => {
        summary[record.status] += 1;
        return summary;
      },
      {
        failed: 0,
        interrupted: 0,
        passed: 0,
        skipped: 0,
        timedOut: 0,
      } satisfies Record<TestResult['status'], number>,
    );

    const completedAt = new Date();
    const duration = this.formatDuration(result.duration);
    const passRate = this.records.length
      ? Math.round((counts.passed / this.records.length) * 100)
      : 0;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${this.escape(this.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f8fb;
      --panel: #ffffff;
      --text: #172033;
      --muted: #697386;
      --line: #dce2ea;
      --passed: #168a53;
      --failed: #c7352f;
      --skipped: #8a6a00;
      --timedOut: #aa4d00;
      --interrupted: #6e57d4;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Arial, Helvetica, sans-serif;
    }

    header {
      background: #18213a;
      color: #ffffff;
      padding: 28px 32px;
    }

    h1, h2, h3, p {
      margin: 0;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
    }

    .subtitle {
      color: #c7d0e2;
      margin-top: 8px;
      font-size: 14px;
    }

    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 28px;
    }

    .summary {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      margin-bottom: 24px;
    }

    .metric, .test {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(23, 32, 51, 0.04);
    }

    .metric {
      padding: 16px;
    }

    .metric-label {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      margin-top: 8px;
    }

    .toolbar {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      font-size: 14px;
      padding: 10px 12px;
    }

    .tests {
      display: grid;
      gap: 12px;
    }

    .test {
      overflow: hidden;
    }

    .test-header {
      align-items: center;
      display: grid;
      gap: 12px;
      grid-template-columns: 110px 1fr auto;
      padding: 14px 16px;
    }

    .status {
      border-radius: 999px;
      color: #ffffff;
      display: inline-flex;
      font-size: 12px;
      font-weight: 700;
      justify-content: center;
      padding: 5px 10px;
      text-transform: uppercase;
    }

    .status-passed { background: var(--passed); }
    .status-failed { background: var(--failed); }
    .status-skipped { background: var(--skipped); }
    .status-timedOut { background: var(--timedOut); }
    .status-interrupted { background: var(--interrupted); }

    .test-title {
      font-size: 15px;
      font-weight: 700;
    }

    .test-meta {
      color: var(--muted);
      font-size: 12px;
      margin-top: 5px;
      word-break: break-word;
    }

    details {
      border-top: 1px solid var(--line);
      padding: 0 16px 14px;
    }

    summary {
      color: var(--muted);
      cursor: pointer;
      font-size: 13px;
      padding: 12px 0;
    }

    pre {
      background: #101828;
      border-radius: 6px;
      color: #f3f6fb;
      overflow: auto;
      padding: 12px;
      white-space: pre-wrap;
    }

    ul {
      margin: 8px 0 0;
      padding-left: 20px;
    }

    a {
      color: #2453d4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header>
    <h1>${this.escape(this.title)}</h1>
    <p class="subtitle">Started ${this.escape(this.startedAt.toLocaleString())} | Completed ${this.escape(completedAt.toLocaleString())}</p>
  </header>
  <main>
    <section class="summary" aria-label="Run summary">
      ${this.renderMetric('Total', this.totalTests.toString())}
      ${this.renderMetric('Passed', counts.passed.toString())}
      ${this.renderMetric('Failed', counts.failed.toString())}
      ${this.renderMetric('Skipped', counts.skipped.toString())}
      ${this.renderMetric('Timed Out', counts.timedOut.toString())}
      ${this.renderMetric('Pass Rate', `${passRate}%`)}
      ${this.renderMetric('Duration', duration)}
      ${this.renderMetric('Run Status', result.status)}
    </section>
    <section class="toolbar">
      <input id="search" type="search" placeholder="Search tests, files, projects, or status" />
    </section>
    <section id="tests" class="tests">
      ${this.records.map((record) => this.renderTest(record, reportPath)).join('\n')}
    </section>
  </main>
  <script>
    const search = document.getElementById('search');
    const tests = Array.from(document.querySelectorAll('[data-search]'));

    search.addEventListener('input', () => {
      const value = search.value.toLowerCase();
      for (const test of tests) {
        test.style.display = test.dataset.search.includes(value) ? '' : 'none';
      }
    });
  </script>
</body>
</html>`;
  }

  private renderMetric(label: string, value: string): string {
    return `<article class="metric">
      <div class="metric-label">${this.escape(label)}</div>
      <div class="metric-value">${this.escape(value)}</div>
    </article>`;
  }

  private renderTest(record: TestRecord, reportPath: string): string {
    const searchText = [
      record.title,
      record.status,
      record.file,
      record.projectName,
      record.location,
    ]
      .join(' ')
      .toLowerCase();

    return `<article class="test" data-search="${this.escapeAttribute(searchText)}">
      <div class="test-header">
        <span class="status status-${record.status}">${this.escape(record.status)}</span>
        <div>
          <div class="test-title">${this.escape(record.title)}</div>
          <div class="test-meta">${this.escape(record.projectName)} | ${this.escape(record.location)} | Retry ${record.retry}</div>
        </div>
        <div class="test-meta">${this.escape(this.formatDuration(record.duration))}</div>
      </div>
      <details>
        <summary>Details</summary>
        ${record.error ? `<pre>${this.escape(record.error)}</pre>` : ''}
        ${this.renderSteps(record.steps)}
        ${this.renderAttachments(record.attachments, reportPath)}
      </details>
    </article>`;
  }

  private renderSteps(steps: string[]): string {
    if (!steps.length) {
      return '';
    }

    return `<h3>Steps</h3><ul>${steps
      .map((step) => `<li>${this.escape(step)}</li>`)
      .join('')}</ul>`;
  }

  private renderAttachments(attachments: TestRecord['attachments'], reportPath: string): string {
    const fileAttachments = attachments.filter((attachment) => attachment.path);
    if (!fileAttachments.length) {
      return '';
    }

    return `<h3>Attachments</h3><ul>${fileAttachments
      .map((attachment) => {
        const relativePath = path
          .relative(path.dirname(reportPath), attachment.path as string)
          .replace(/\\/g, '/');
        return `<li><a href="${this.escapeAttribute(relativePath)}">${this.escape(attachment.name)} (${this.escape(attachment.contentType)})</a></li>`;
      })
      .join('')}</ul>`;
  }

  private formatDuration(duration: number): string {
    if (duration < 1000) {
      return `${duration}ms`;
    }

    return `${(duration / 1000).toFixed(1)}s`;
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private escapeAttribute(value: string): string {
    return this.escape(value).replace(/`/g, '&#96;');
  }
}
