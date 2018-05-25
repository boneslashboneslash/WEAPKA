 // basics metod for adding and deleting actual task objects from the tasks array
 // constructor allows model to call notify() method on each object after adding, or editing.. etc...
 // this model is giving the responsibility then up to TaskView class.
 var TaskModel = function () {
     var database = firebase.database();
     var taskRef = database.ref().child("Tasks");
     taskRef.on("value", function(snapshot) {
         //var newTask = snapshot.val();
        //var html = "";
        //console.log(snapshot.val());
        snapshot.forEach(function(item){
            // unable to save it from database, only read!
            console.log(item.val().taskIndex, item.val().taskName, item.val().taskStatus);
           //html = "<div style='color: red; font-weight: bold; font-size: large'> ";
            //$(".js-tasks-container").append(html + "<label><input type='checkbox' class='js-task' data-index='" + item.val().taskIndex + "' data-task-selected='false'>" + item.val().taskName + "</label></div>");
        });
            //console.log(JSON.stringify(item));
         });
     //var h = $("div.js-tasks-complete-container");
     //console.log(h);
     this.tasks = [];
     this.index = this.tasks.length;
     this.selectedTasks = [];
     this.addTaskEvent = new Event(this);
     this.setTasksAsCompletedEvent = new Event(this);
     this.deleteTasksEvent = new Event(this);
     this.editTasksEvent = new Event(this);
 };

 TaskModel.prototype = {

     addTask: function (task) {
      if(task != "")
      {


         data = {
             taskName: task,
             taskStatus: 'uncompleted',
             taskIndex: this.index
         }
         this.tasks.push(data);
         writeUserData(this.index,task,'uncompleted',this.index );
          this.index = this.index+1;
      }
         this.addTaskEvent.notify();

     },

     getTasks: function () {
         return this.tasks;
     },

     setSelectedTask: function (taskIndex) {
         this.selectedTasks.push(taskIndex);
     },

     unselectTask: function (taskIndex) {
         this.selectedTasks.splice(taskIndex, 1);
     },

     setTasksAsCompleted: function () {
         var database = firebase.database();
         var selectedTasks = this.selectedTasks;
         for (var index in selectedTasks) {
             var indexin = this.tasks[selectedTasks[index]].taskIndex;
             var taskN= this.tasks[selectedTasks[index]].taskName;
             writeUserData(indexin,taskN,"completed",indexin);
             this.tasks[selectedTasks[index]].taskStatus = "completed";

         }

         this.setTasksAsCompletedEvent.notify();

         this.selectedTasks = [];

     },


     deleteTasks: function () {
         var database = firebase.database();
         var selectedTasks = this.selectedTasks.sort();
            //deleted task
         for (var i = selectedTasks.length - 1; i >= 0; i--) {
             database.ref().child('/Tasks/'+this.tasks[selectedTasks[i]].taskIndex).remove();

             //console.log(data);

             this.tasks.splice(this.selectedTasks[i], 1);
         }
        if (selectedTasks.length == 0)
        {
            for (var i = 0; i < this.tasks.length; i++) {
                database.ref().child('/Tasks/' + this.tasks[i].taskIndex).remove();
            }
            this.tasks.splice(0,this.tasks.length);

        }

         // clear the selected tasks
         this.selectedTasks = [];

         this.deleteTasksEvent.notify();

     },
     editTasks:function(){
         var selectedTasks = this.selectedTasks;
         for (var index in selectedTasks) {
             if(this.tasks[selectedTasks[index]].taskStatus != 'completed')
             {
                 this.tasks[selectedTasks[index]].taskStatus = 'edited';
             }


         }
         this.selectedTasks = [];
         // clear the selected tasks
        this.editTasksEvent.notify();

     }

 }

 function writeUserData(TaskId, name, status, index) {
     firebase.database().ref('Tasks/' + TaskId).set({
         taskName: name,
         taskStatus: status,
         taskIndex: index
     });


 };