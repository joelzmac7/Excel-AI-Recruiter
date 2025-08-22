import React, { useState } from 'react';
import { ToDo, RecruiterInfo } from '../types';

// EOS AI Enhancement Function
const enhanceWithEOS = (title: string, description: string, type: 'todo' | 'issue'): string => {
    const baseDescription = description || title;
    
    if (type === 'todo') {
        return `${baseDescription}

📋 EOS Action Item Framework:
• SPECIFIC: What exactly needs to be done?
• MEASURABLE: How will you know it's complete?
• ASSIGNABLE: Who is accountable for this?
• REALISTIC: Is this achievable with current resources?
• TIME-BOUND: When must this be completed?

💡 Success Tips:
- Break large tasks into smaller, actionable steps
- Set clear completion criteria
- Schedule specific time blocks for execution
- Identify any dependencies or blockers upfront`;
    }
    
    return baseDescription;
};

interface TodosViewProps {
    todos: ToDo[];
    setTodos: (todos: ToDo[]) => void;
    recruiterInfo: RecruiterInfo;
}

const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
};

const TodoItem: React.FC<{
    todo: ToDo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ todo, onToggle, onDelete }) => {
    const isOverdue = new Date(todo.dueDate) < new Date() && !todo.completed;
    const dueDate = new Date(todo.dueDate);
    const isToday = dueDate.toDateString() === new Date().toDateString();

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border ${
            todo.completed ? 'border-green-200 bg-green-50' : 
            isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
        }`}>
            <div className="flex items-start space-x-3">
                <button
                    onClick={() => onToggle(todo.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                        todo.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-primary-500'
                    }`}
                >
                    {todo.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-sm font-medium ${
                            todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                            {todo.title}
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
                                {todo.priority}
                            </span>
                            <button
                                onClick={() => onDelete(todo.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {todo.description && (
                        <p className={`text-sm mb-2 ${
                            todo.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {todo.description}
                        </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            {todo.assignedBy !== todo.assignedTo && `Assigned by: ${todo.assignedBy}`}
                        </span>
                        <span className={`${
                            isOverdue ? 'text-red-600 font-medium' : 
                            isToday ? 'text-yellow-600 font-medium' : ''
                        }`}>
                            Due: {dueDate.toLocaleDateString()}
                            {isToday && ' (Today)'}
                            {isOverdue && ' (Overdue)'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TodosView: React.FC<TodosViewProps> = ({ todos, setTodos, recruiterInfo }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium' as ToDo['priority'],
        category: ''
    });

    const filteredTodos = todos.filter(todo => {
        if (filter === 'pending') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const handleToggleTodo = (id: string) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleDeleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        // EOS AI Enhancement
        const enhancedDescription = enhanceWithEOS(newTodo.title, newTodo.description, 'todo');

        const todo: ToDo = {
            id: Date.now().toString(),
            title: newTodo.title,
            description: enhancedDescription,
            assignedTo: recruiterInfo.id || recruiterInfo.name,
            assignedBy: recruiterInfo.id || recruiterInfo.name,
            dueDate: newTodo.dueDate,
            completed: false,
            priority: newTodo.priority,
            category: newTodo.category,
            createdAt: new Date().toISOString()
        };

        setTodos([...todos, todo]);
        setNewTodo({
            title: '',
            description: '',
            dueDate: '',
            priority: 'medium',
            category: ''
        });
        setShowAddForm(false);
    };

    const pendingTodos = todos.filter(t => !t.completed);
    const overdueTodos = pendingTodos.filter(t => new Date(t.dueDate) < new Date());
    const todayTodos = pendingTodos.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString());

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">To-Dos</h1>
                    <p className="text-gray-600">Manage your tasks and assignments</p>
                </div>
                
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add To-Do
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{pendingTodos.length}</div>
                    <div className="text-sm text-gray-600">Pending Tasks</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{todayTodos.length}</div>
                    <div className="text-sm text-gray-600">Due Today</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">{overdueTodos.length}</div>
                    <div className="text-sm text-gray-600">Overdue</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {todos.filter(t => t.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2">
                {(['all', 'pending', 'completed'] as const).map((filterOption) => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filter === filterOption
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                    </button>
                ))}
            </div>

            {/* Add Todo Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <form onSubmit={handleAddTodo} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={newTodo.title}
                                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={newTodo.dueDate}
                                    onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={newTodo.priority}
                                    onChange={(e) => setNewTodo({...newTodo, priority: e.target.value as ToDo['priority']})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={newTodo.category}
                                    onChange={(e) => setNewTodo({...newTodo, category: e.target.value})}
                                    placeholder="e.g., Sourcing, Follow-up"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Add To-Do
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Todos List */}
            <div className="space-y-3">
                {filteredTodos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                    />
                ))}
            </div>

            {filteredTodos.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No to-dos found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first task.</p>
                </div>
            )}
        </div>
    );
};

export default TodosView;