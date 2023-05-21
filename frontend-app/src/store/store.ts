import { defineStore } from 'pinia';

interface Subtask {
    id: number;
    text: string;
    completed: boolean;
}

interface Task {
    id: number;
    text: string;
    completed: boolean;
    subtasks: Subtask[];
    showSubtasks: boolean;
}

export const useTasksStore = defineStore({
    id: 'tasks',
    state: () => ({
        tasks: [] as Task[],
        deletedTasks: [] as Task[],
    }),
    actions: {
        /**
         * Добавление новой задачи
         * @param text - текст задачи
         * @param subtasksTexts - массив текстов подзадач
         */
        addTask(text: string, subtasksTexts: string[]): void {
            const newTask = {
                id: Date.now(),
                text,
                completed: false,
                subtasks: subtasksTexts.map((subtaskText) => ({
                    id: Date.now(),
                    text: subtaskText,
                    completed: false,
                })),
                showSubtasks: false,
            };
            const { tasks, saveTasks } = this;
            tasks.push(newTask);
            saveTasks();
        },
        /**
         * Удаление задачи по ID
         * @param id - ID задачи для удаления
         */
        removeTask(id: number): void {
            const { tasks, deletedTasks, saveTasks } = this;
            const deletedTask = tasks.find((task) => task.id === id);
            if (deletedTask) {
                deletedTasks.push(deletedTask);
            }
            this.tasks = tasks.filter((task) => task.id !== id);
            saveTasks();
        },
        /**
         * Удаление всех задач и подзадач
         */
        removeAllTasks(): void {
            const { tasks, deletedTasks, saveTasks } = this;
            deletedTasks.push(...tasks);
            this.tasks = [];
            saveTasks();
        },
        /**
         * Восстановление удаленных задач
         */
        restoreDeletedTasks(): void {
            const { tasks, deletedTasks, saveTasks } = this;
            tasks.push(...deletedTasks);
            this.deletedTasks = [];
            saveTasks();
        },
        /**
         * Сохранение задач в локальном хранилище
         */
        saveTasks(): void {
            const { tasks, deletedTasks } = this;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
        },
        /**
         * Загрузка задач из локального хранилища
         */
        loadTasks(): void {
            const { tasks } = this;
            const storedTasks = localStorage.getItem('tasks');
            this.tasks = storedTasks ? JSON.parse(storedTasks) : tasks;

            const { deletedTasks } = this;
            const storedDeletedTasks = localStorage.getItem('deletedTasks');
            this.deletedTasks = storedDeletedTasks ? JSON.parse(storedDeletedTasks) : deletedTasks;
        },
        /**
         * Переключение состояния подзадачи (выполнена/не выполнена)
         * @param taskId - ID задачи
         * @param subtaskId - ID подзадачи
         */
        toggleSubtask(taskId: number, subtaskId: number): void {
            const { tasks, saveTasks } = this;
            const task = tasks.find((task) => task.id === taskId);
            if (task && task.subtasks) {
                const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = !subtask.completed;
                    saveTasks();
                }
            }
        },
        /**
         * Переключение состояния задачи (выполнена/не выполнена)
         * @param taskId - ID задачи
         */
        toggleTask(taskId: number): void {
            const {tasks, saveTasks} = this;
            const task = tasks.find((task) => task.id === taskId);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
            }
        },
    },
});
