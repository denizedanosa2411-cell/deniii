import { Suspense, useOptimistic, useEffect, useCallback, useDeferredValue, useRef, useMemo, useReducer, useState, useTransition } from 'react';
import { tasksReducer } from './tasksReducer.js';
import { AddTaskForm } from './components/AddTaskForm.jsx';
import { TaskList } from './components/TaskList.jsx';
import { useTheme } from './ThemeContext.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { SearchBox } from './components/SearchBox.jsx';
import { useLanguage } from './LanguageContext.jsx';
import { LanguageToggle } from './components/LanguageToggle.jsx';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { fetchTip } from './api.js';
import { TipOfDay } from './components/TipOfDay.jsx';

function makeTestTasks(){
return Array.from({ length: 2000 }, (_, i) => ({
id: 'test-' + Date.now() + '-' + i,
text: "Тестовая задача " + (i + 1),
done: false,}));
}
function loadTasks() {
try {
return JSON.parse(localStorage.getItem('tasks')) ?? [];
}
catch {
return [];
}
}


const tipPromise = fetchTip();
export default function App() {
  const { theme } = useTheme();
  const { lang } = useLanguage();
   const [tasks, dispatch] = useReducer(tasksReducer, [], loadTasks);
   const [optimisticTasks, addOptimisticTask] = useOptimistic(tasks, (current, newTask) => [
     ...current,
     {...newTask, pending: true },
  ]);
   const online = useOnlineStatus();
    useEffect(() => {
         localStorage.setItem('tasks', JSON.stringify(tasks));
         }, [tasks]);



const handleAdd = useCallback((task) => {
  dispatch({ type: 'add', task });
}, []);
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const handleRename = useCallback((id, text) => dispatch({ type: 'rename', id, text }), []);
  const [filter, setFilter] = useState('all');

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef(null);


const visibleTasks = useMemo(() => {
  const q = deferredQuery.trim().toLowerCase();
  return optimisticTasks.filter((t) => {
    const byFilter = filter === 'all' || (filter === 'done' ? t.done : !t.done);
    return byFilter && t.text.toLowerCase().includes(q);
  });
}, [optimisticTasks, deferredQuery, filter]);


  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  return (
    <div className={'app ' + theme}>
      <div className="card">
        <header className="top">
          <p className="muted">{online ? 'Онлайн' : 'Нет сети'}</p>
          <Suspense fallback = {<p className= "muted">Загружаем совет...</p>}>
             <TipOfDay tipPromise={tipPromise} />
          </Suspense>
          <h1>{lang === 'ru' ? 'Менеджер задач' : 'Task manager'}</h1>
          <div className="actions">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="toolbar">
          
<SearchBox ref={searchRef} value={query} onChange={setQuery} />
<button onClick={() => searchRef.current.clear()}>Сбросить</button>
</div>

        <AddTaskForm onAdd={handleAdd} onOptimistic={addOptimisticTask} />
        <div className="tabs">
          {[['all', 'Все'], ['active', 'Активные'], ['done', 'Готовые']].map(([key, label]) => (
            <button key={key} className={filter === key ? 'active' : ''} onClick={() => startTransition(() => setFilter(key))}
>
              {label}
            </button>
          ))}
        </div>
        <p className="muted">
          Всего: {tasks.length}, выполнено: {doneCount}
          {isPending && ' обновляем...'}
          </p>
        <TaskList tasks={visibleTasks} onToggle={handleToggle} onRemove=
        {handleRemove} />
        <div className='toolbar'>
          <button onClick={() => dispatch({ type: 'clearDone' })} >Удалить
            Выполненные</button>
            <button onClick={()=> dispatch({ type: 'addMany', tasks:
              makeTestTasks()})} >+2000 тестовых</button>
              <button onClick={() => dispatch({type: 'ClearAll'})}>Удалить
                все</button>
        </div>
      </div>
    </div>
  );
}
