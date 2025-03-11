import { useState, useMemo } from "react";
import PlusIcon from "./PlusIcon";
import ColContainer from "./ColContainer";
import { Column, Id, Task } from "../types";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function Kboard() {
	const [columns, setColumns] = useState<Column[]>([]);
	const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const sensors = useSensor(PointerSensor, { activationConstraint: { distance: 3 } });
	return (
		<div className='
			m-auto
			flex
			flex-col
			w-full
			overflow-x-auto
			overflow-y-hidden
			px-[4px]
			gap-3
			p-2
		   '>
			
			<DndContext sensors={[sensors]} onDragStart={onDragStart} onDragEnd={onDragEnd}
				onDragOver={onDragOver}
			>

				<button onClick={() => { createNewColumn(); }} className='
				h-[60px] w-[350px]
				min-w-[350px]
				cursor-pointer
				rounded-lg
			  bg-mainBackgroundColor
			  border-2
			  border-columnBackgroundColor
			  p-4
			  ring-rose-500
			  hover:ring-2
			  flex gap-2 my-2 '>
					<PlusIcon />
					Add Column

				</button>

				<div
					className="m-auto grid gap-4"
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${Math.min(columns.length, 5)}, 1fr)`, // Max 3 columns
					}}
				>
					<SortableContext items={columnsId}>
						{columns.map((col) => (
							<ColContainer
								key={col.id}
								column={col}
								deleteColumn={deleteColumn}
								updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter((task) => task.columnId === col.id)}
							/>
						))}
					</SortableContext>
				</div>


				{createPortal(



					<DragOverlay>
						{activeColumn && (
							<ColContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn}
								createTask={createTask}
								deleteTask={deleteTask}
								updateTask={updateTask}
								tasks={tasks.filter(task => task.columnId === activeColumn.id)}


								
							/>

						)}
						{ activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} /> }
					</DragOverlay>, document.body)}
			</DndContext>
		</div>
	);
	function updateTask(id: Id, content: string) {
		const updatedTasks = tasks.map((task) => {
			if (task.id !== id) {
				return task;
			}
			return { ...task, content };
		});
		setTasks(updatedTasks);
	}
	function createTask(columnId: Id) {
		const newTask: Task = {
			id: generateId(),
			columnId,
			content: `Task ${tasks.length + 1}`,
		};
		setTasks([...tasks, newTask]);
	}
	function deleteTask(id: Id) {
		const newTasks = tasks.filter((task) => task.id !== id);
		setTasks(newTasks);
	}
	function createNewColumn() {
		const columnToAdd: Column = {
			id: generateId(),
			title: `Column ${columns.length + 1}`,
		};
		setColumns([...columns, columnToAdd]);
	}
	function deleteColumn(id: Id) {
		const filterColumns = columns.filter(col => col.id !== id);
		setColumns(filterColumns);
		const newTasks = tasks.filter(task => task.columnId !== id);
		setTasks(newTasks);
	}
	function updateColumn(id: Id, title: string) {
		const updatedColumns = columns.map((col) => {
			if (col.id !== id) {
				return col;
			}
			return { ...col, title };
		});
		setColumns(updatedColumns);
	}
	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}
		if (event.active.data.current?.type === "Task") {
			setActiveTask(event.active.data.current.task);
			return;
		}
	}
	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;
		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;
		const isActiveTask = active.data.current?.type === 'Task';
		const isOverTask = over.data.current?.type === 'Task';
		if (!isActiveTask) return;
		if (isActiveTask && isOverTask) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((task) => task.id === active.id);
				const overIndex = tasks.findIndex((task) => task.id === over.id);
				tasks[activeIndex].columnId = tasks[overIndex].columnId;
				return arrayMove(tasks, activeIndex, overIndex);
			});
		}
		const isOverAColumn = over.data.current?.type === 'Column';
		// i am dropping a task voer antoehr task
		if (isActiveTask && isOverAColumn) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((task) => task.id === active.id);
				tasks[activeIndex].columnId = overId;
				return arrayMove(tasks, activeIndex, activeIndex);
			});
		}
	};
	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveTask(null);
		const { active, over } = event;
		if (!over) return;
		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;
		setColumns((col) => {
			const activeIndex = col.findIndex((c) => c.id === activeId);
			const overIndex = col.findIndex((c) => c.id === overId);
			return arrayMove(col, activeIndex, overIndex);
		})
	}
};
function generateId() {
	return Math.floor(Math.random() * 10001);
}
export default Kboard;