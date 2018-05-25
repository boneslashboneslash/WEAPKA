// The constructor function sets up five Event objects
//This allows the view to call the notify() method on each Event object
// and the responsibility is up to Controller
var TaskView = function (model) {

    this.model = model;
    this.addTaskEvent = new Event(this);
    this.selectTaskEvent = new Event(this);
    this.unselectTaskEvent = new Event(this);
    this.completeTaskEvent = new Event(this);
    this.deleteTaskEvent = new Event(this);
    this.editTaskEvent = new Event(this);
    this.init();
};
//init method uses method chaining to create the structure of the whole project
TaskView.prototype = {

    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable()

    },
// caches jscontainer element and then refers to that variable for each element
// thereafter it needs to find() (event for every each button)
    createChildren: function () {
        // cache the document object
        this.$container = $('.js-container');
        this.$addTaskButton = this.$container.find('.js-add-task-button');
        this.$taskTextBox = this.$container.find('.js-task-textbox');
        this.$tasksContainer = this.$container.find('.js-tasks-container');
        this.$completeContainer = this.$container.find('.js-tasks-complete-container');
        return this;
    },
// This method is setting up the event handlers and changing the scope of the this keyword inside that handler
 // This changes this keyword scope to point to class that initialized that event.
    setupHandlers: function () {

        this.addTaskButtonHandler = this.addTaskButton.bind(this);
        this.selectOrUnselectTaskHandler = this.selectOrUnselectTask.bind(this);
        this.completeTaskButtonHandler = this.completeTaskButton.bind(this);
        this.deleteTaskButtonHandler = this.deleteTaskButton.bind(this);
        this.editTaskButtonHandler = this.editTaskButton.bind(this);
        /**
         Handlers from Event Dispatcher
         */
        this.addTaskHandler = this.addTask.bind(this);
        this.clearTaskTextBoxHandler = this.clearTaskTextBox.bind(this);
        this.setTasksAsCompletedHandler = this.setTasksAsCompleted.bind(this);
        this.deleteTasksHandler = this.deleteTasks.bind(this);
        this.editTasksHandler = this.editTasks.bind(this);
        return this;
    },
// This method sets up any DOM events and attaches any functions to the Event Dispatcher that were created by the Model
    enable: function () {

        this.$addTaskButton.click(this.addTaskButtonHandler);
        this.$container.on('click', '.js-task', this.selectOrUnselectTaskHandler);
        this.$container.on('click', '.js-complete-task-button', this.completeTaskButtonHandler);
        this.$container.on('click', '.js-delete-task-button', this.deleteTaskButtonHandler);
        this.$container.on('click', '.js-edit-task-button',this.editTaskButtonHandler);
        /**
         * Event Dispatcher
         */
        this.model.addTaskEvent.attach(this.addTaskHandler);
        this.model.addTaskEvent.attach(this.clearTaskTextBoxHandler);
        this.model.setTasksAsCompletedEvent.attach(this.setTasksAsCompletedHandler);
        this.model.deleteTasksEvent.attach(this.deleteTasksHandler);
        this.model.editTasksEvent.attach(this.editTasksHandler);
        return this;
    },

    addTaskButton: function () {
        //console.log(this.$taskTextBox.val());
        this.addTaskEvent.notify({
            task: this.$taskTextBox.val()



        });
    },

    completeTaskButton: function () {
        this.completeTaskEvent.notify();
    },

    deleteTaskButton: function () {
        this.deleteTaskEvent.notify();
    },
    editTaskButton: function(){
        this.editTaskEvent.notify();
    },


    selectOrUnselectTask: function () {

        var taskIndex = $(event.target).attr("data-index");

        if ($(event.target).attr('data-task-selected') == 'false') {
            $(event.target).attr('data-task-selected', true);
            this.selectTaskEvent.notify({

                taskIndex: taskIndex
            });
        } else {
            $(event.target).attr('data-task-selected', false);
            this.unselectTaskEvent.notify({
                taskIndex: taskIndex
            });
        }

    },

    show: function () {
        this.buildList();
    },

    buildList: function () {
        var tasks = this.model.getTasks();
        var html = "";
        var $tasksContainer = this.$tasksContainer;
        var $completeContainer = this.$completeContainer;
        $tasksContainer.html('');
        $completeContainer.html('');
        //console.log(tasks);
        var index = 0;
        for (var task in tasks) {
            //console.log(tasks[task]);
            if (tasks[task].taskStatus == 'completed') {
                html = "<div style='color:green;font-weight: bold; float:left; text-decoration: line-through; font-size: large'>";
                $completeContainer.append(html + "<label><input type='checkbox' class='js-task' data-index='" + index + "' data-task-selected='false'>" + tasks[task].taskName + "</label></div>");
            }
            else if  (tasks[task].taskStatus == 'edited' || tasks[task].taskStatus == 'uncompleted') {
                if(tasks[task].taskStatus == 'edited')
                {
                    tasks[task].taskName = this.$taskTextBox.val();
                    tasks[task].taskStatus = 'uncompleted';
                }
                html = "<div style='color: red; font-weight: bold; font-size: large'> ";
                $tasksContainer.append(html + "<label><input type='checkbox' class='js-task' data-index='" + index + "' data-task-selected='false'>" + tasks[task].taskName + "</label></div>");
            }



            index++;
        }

    },



    /* -------------------- Handlers From Event Dispatcher ----------------- */

    clearTaskTextBox: function () {
        this.$taskTextBox.val('');
    },

    addTask: function () {
        this.show();
    },

    setTasksAsCompleted: function () {
        this.show();

    },

    deleteTasks: function () {
        this.show();

    },
    editTasks: function(){
        this.show();
    }

    /* -------------------- End Handlers From Event Dispatcher ----------------- */


};