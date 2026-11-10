import { startTransition, useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { saveTaskOnServer } from '../api.js';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Сохраняем...' : 'Добавить'}</button>;
}

export function AddTaskForm({ onAdd, onOptimistic }) {
  const inputId = useId();

  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      const text = String(formData.get('text')).trim();
      if (!text)
        return { error: 'Введите текст задачи', text: '' };
      
      const task = { id: Date.now(), text, done: false };
      onOptimistic(task);
      try {
        await saveTaskOnServer(task);
      }
      catch (e) {
        return { error: e.message, text };
      }

      startTransition(() => onAdd(task));
      return { error: null, text: '' }
    },
    { error: null, text: '' }
  );

  return (
    <form action={formAction}>
      <label htmlFor={inputId} className="sr">Новая задача</label>
      <input id={inputId} name="text" type="text" defaultValue={state.text} placeholder="Новая задача" />
      <SubmitButton />
      {state.error && <p className="error" role="alert">{state.error}</p>}
    </form>
  );
}