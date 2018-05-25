// taking a care of TASKS MVC architecture (creating instance of MVC)
 $(function () {
     var model = new TaskModel(),
         view = new TaskView(model),
         controller = new TaskController(model, view);
 });