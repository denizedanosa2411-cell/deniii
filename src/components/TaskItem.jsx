import { memo } from 'react';

export const TaskItem = memo(function TaskItem({ task, onToggle, onRemove, onRename }) {
  console.log('Рисуем задачу:', task.text);

  function handleRename() {
    const newText = prompt('Новый текст задачи', task.text);
    if (newText === null) return; // нажали «Отмена»
    const clean = newText.trim();
    if (!clean) return;
    onRename(task.id, clean);
  }

  return (
    <li className={(task.done ? 'done' : '') + (task.pending ? 'pending' : '')}>
      <input type="checkbox" checked={task.done} disabled={task.pending} onChange={() => onToggle(task.id)} />
      <span>{task.text}</span>
      <button onClick={handleRename}>Редактирование</button>
      <button onClick={() => onRemove(task.id)}>×</button>
    </li>
  );
});
