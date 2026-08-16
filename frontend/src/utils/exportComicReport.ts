// src/utils/exportComicReport.ts
import type { Task } from '../types/task';

export function exportComicReport(tasks: Task[], username = 'AGENT') {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed || t.status === 'completed').length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate your Comic Mission Report PDF!');
    return;
  }

  const priorityLabels: Record<number, { text: string; bg: string; color: string }> = {
    4: { text: 'URGENT', bg: '#ff007a', color: '#ffffff' },
    3: { text: 'HIGH', bg: '#ffe600', color: '#000000' },
    2: { text: 'MEDIUM', bg: '#00f0ff', color: '#000000' },
    1: { text: 'LOW', bg: '#00ff66', color: '#000000' },
  };

  const tasksHtml = tasks
    .map((task, idx) => {
      const p = priorityLabels[task.priority] || priorityLabels[2];
      const isDone = task.completed || task.status === 'completed';
      const subtasks = task.subtasks || [];
      const subtasksHtml =
        subtasks.length > 0
          ? `<div class="subtasks-container">
              <div class="subtask-title">CHECKLIST [${subtasks.filter((s) => s.completed).length}/${subtasks.length}]:</div>
              <div class="subtask-list">
                ${subtasks
                  .map(
                    (s) => `
                  <div class="subtask-item ${s.completed ? 'subtask-done' : ''}">
                    <span class="subtask-box">${s.completed ? '✔' : ''}</span>
                    <span>${s.text}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>`
          : '';

      return `
        <div class="task-card ${isDone ? 'task-done' : ''}">
          <div class="task-header" style="background: ${p.bg}; color: ${p.color};">
            <span class="badge">[#${idx + 1}] ${p.text} PRIORITY</span>
            <span class="status-stamp">${isDone ? 'MISSION ACCOMPLISHED ✔' : 'OBJECTIVE ACTIVE ⏳'}</span>
          </div>
          <div class="task-body">
            <h3 class="task-title ${isDone ? 'title-done' : ''}">${task.title}</h3>
            ${task.description ? `<p class="task-desc">${task.description}</p>` : ''}
            
            <div class="task-meta">
              <span class="meta-tag tag-cat">📂 ${(task.category || 'general').toUpperCase()}</span>
              ${task.due_date ? `<span class="meta-tag tag-due">📅 DUE: ${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
              ${task.estimated_minutes ? `<span class="meta-tag tag-pomo">⚡ ${task.estimated_minutes}M FOCUS</span>` : ''}
            </div>

            ${subtasksHtml}
          </div>
        </div>
      `;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Taskify Pro - Comic Mission Dossier (${username})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 12mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #fdfaf0;
      color: #000000;
      padding: 20px;
    }
    .halftone-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(#000000 1.2px, transparent 1.2px);
      background-size: 16px 16px;
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
    }
    .dossier-wrapper {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      border: 4px solid #000000;
      background: #ffffff;
      box-shadow: 8px 8px 0px #000000;
      padding: 24px;
      border-radius: 12px;
    }
    .comic-top-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 4px solid #000000;
      padding-bottom: 16px;
      margin-bottom: 20px;
      background: #ffe600;
      padding: 16px;
      border-radius: 8px;
      border: 3px solid #000000;
      box-shadow: 4px 4px 0px #000000;
    }
    .comic-brand {
      font-family: 'Bangers', cursive, 'Inter', sans-serif;
      font-size: 36px;
      letter-spacing: 2px;
      color: #000000;
      text-shadow: 2px 2px 0px #ffffff;
      line-height: 1;
    }
    .comic-brand span {
      color: #ff007a;
    }
    .dossier-stamp {
      background: #ff007a;
      color: #ffffff;
      font-weight: 900;
      font-size: 12px;
      padding: 6px 14px;
      border: 2px solid #000000;
      border-radius: 6px;
      box-shadow: 3px 3px 0px #000000;
      transform: rotate(2deg);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .meta-strip {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 20px;
      padding: 8px 12px;
      background: #f4f4f5;
      border: 2px solid #000000;
      border-radius: 8px;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      border: 3px solid #000000;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      box-shadow: 4px 4px 0px #000000;
    }
    .kpi-label {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .kpi-val {
      font-size: 26px;
      font-weight: 900;
      font-family: monospace;
      line-height: 1;
    }
    .tasks-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .task-card {
      border: 3px solid #000000;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 4px 4px 0px #000000;
      page-break-inside: avoid;
    }
    .task-card.task-done {
      opacity: 0.85;
      background: #f8fafc;
    }
    .task-header {
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 900;
      border-bottom: 2px solid #000000;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .task-body {
      padding: 14px;
    }
    .task-title {
      font-size: 16px;
      font-weight: 900;
      margin-bottom: 6px;
      color: #000000;
    }
    .task-title.title-done {
      text-decoration: line-through;
      color: #52525b;
    }
    .task-desc {
      font-size: 12px;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .task-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .meta-tag {
      font-size: 10px;
      font-weight: 900;
      padding: 3px 8px;
      border: 1.5px solid #000000;
      border-radius: 6px;
      text-transform: uppercase;
      box-shadow: 2px 2px 0px #000000;
    }
    .tag-cat { background: #00f0ff; color: #000; }
    .tag-due { background: #ffe600; color: #000; }
    .tag-pomo { background: #ff007a; color: #fff; }
    .subtasks-container {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 2px dashed #000000;
    }
    .subtask-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .subtask-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 6px;
    }
    .subtask-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .subtask-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border: 1.5px solid #000000;
      border-radius: 4px;
      font-weight: 900;
      font-size: 11px;
      background: #ffffff;
    }
    .subtask-done .subtask-box {
      background: #00ff66;
    }
    .subtask-done span:last-child {
      text-decoration: line-through;
      color: #71717a;
    }
    .dossier-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 3px solid #000000;
      padding-top: 14px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .no-print-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .comic-btn-print {
      background: #00ff66;
      color: #000000;
      font-weight: 900;
      font-size: 14px;
      padding: 12px 24px;
      border: 3px solid #000000;
      border-radius: 10px;
      box-shadow: 4px 4px 0px #000000;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .comic-btn-print:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000000;
    }
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
        background: #ffffff;
      }
      .dossier-wrapper {
        box-shadow: none;
        border: 3px solid #000000;
      }
    }
  </style>
</head>
<body>
  <div class="halftone-overlay"></div>
  
  <div class="no-print-bar">
    <button class="comic-btn-print" onclick="window.print()">🖨️ PRINT / SAVE AS COMIC PDF</button>
  </div>

  <div class="dossier-wrapper">
    <div class="comic-top-banner">
      <div>
        <div class="comic-brand">TASKIFY <span>PRO</span></div>
        <div style="font-size: 11px; font-weight: 900; letter-spacing: 1px; margin-top: 2px;">OFFICIAL MISSION LOG & PRODUCTIVITY DOSSIER</div>
      </div>
      <div class="dossier-stamp">TOP SECRET • CLASSIFIED</div>
    </div>

    <div class="meta-strip">
      <div><strong>AGENT:</strong> ${username.toUpperCase()}</div>
      <div><strong>DATE:</strong> ${dateStr}</div>
      <div><strong>CLEARANCE:</strong> LEVEL 5 (UNRESTRICTED)</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card" style="background: #ffffff;">
        <div class="kpi-label">TOTAL OBJECTIVES</div>
        <div class="kpi-val">${total}</div>
      </div>
      <div class="kpi-card" style="background: #00ff66;">
        <div class="kpi-label">COMPLETED ✔</div>
        <div class="kpi-val">${completed}</div>
      </div>
      <div class="kpi-card" style="background: #ff007a; color: #ffffff;">
        <div class="kpi-label">PENDING ⏳</div>
        <div class="kpi-val">${pending}</div>
      </div>
      <div class="kpi-card" style="background: #ffe600;">
        <div class="kpi-label">SUCCESS RATE</div>
        <div class="kpi-val">${rate}%</div>
      </div>
    </div>

    <div class="tasks-grid">
      ${tasksHtml}
    </div>

    <div class="dossier-footer">
      <div>TASKIFY HQ • MULTIVERSE EDITION</div>
      <div>AUTHORIZED DISPATCH // MISSION CONTINUES 💥</div>
    </div>
  </div>

  <script>
    // Auto prompt print dialog after font loading
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
