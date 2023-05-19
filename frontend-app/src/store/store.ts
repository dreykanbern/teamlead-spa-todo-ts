import { defineStore } from 'pinia';

interface Task {
    id: number;
    text: string;
    completed: boolean;
    subtasks: {
        id: number;
        text: string;
        completed: boolean;
    }[];
    showSubtasks: boolean;
}

export const useTasksStore = defineStore({
    id: 'tasks',
    state: () => ({
        tasks: [] as Task[],
        // Добавление нового свойства для хранения удаленных задач
        deletedTasks: [] as Task[],
    }),
    actions: {
        addTask(text: string, subtasksTexts: string[]) {
            const newTask = {
                id: Date.now(),
                text,
                completed: false,
                subtasks: subtasksTexts.map((subtaskText: string) => ({
                    id: Date.now(),
                    text: subtaskText,
                    completed: false,
                })),
                showSubtasks: false,
            };
            this.tasks.push(newTask);
            this.saveTasks();
        },
        removeTask(id: number) {
            // Сохранение удаленной задачи в свойстве deletedTasks
            const deletedTask = this.tasks.find((task) => task.id === id);
            if (deletedTask) {
                this.deletedTasks.push(deletedTask);
            }
            this.tasks = this.tasks.filter((task) => task.id !== id);
            this.saveTasks();
        },
        // Метод для удаления всех задач и подзадач
        removeAllTasks() {
            // Сохранение всех удаленных задач в свойстве deletedTasks
            this.deletedTasks.push(...this.tasks);
            this.tasks = [];
            this.saveTasks();
        },
        // Метод для восстановления удаленных задач
        restoreDeletedTasks() {
            this.tasks.push(...this.deletedTasks);
            this.deletedTasks = [];
            this.saveTasks();
        },
        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            // Сохранение удаленных задач в локальном хранилище
            localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
        },
        loadTasks() {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                this.tasks = JSON.parse(tasks);
            }
            // Загрузка удаленных задач из локального хранилища
            const deletedTasks = localStorage.getItem('deletedTasks');
            if (deletedTasks) {
                this.deletedTasks = JSON.parse(deletedTasks);
            }
        },
    },
});