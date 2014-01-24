!function(){var a=window.MyYoga=Ember.Application.create({apiVersion:"v1"});Ember.Application.initializer({name:"auth",after:"store",initialize:function(b){a.deferReadiness(),a.MyUser=a.Auth.create();var c=a.MyUser.get("uid");if(c){var d=b.lookup("store:main");d.find("user",c).then(function(b){a.MyUser.set("user",b),a.advanceReadiness()},function(){a.advanceReadiness()})}else a.advanceReadiness()}})}(),function(){MyYoga.ApplicationController=Ember.Controller.extend({loggedIn:function(){return MyYoga.MyUser.get("loggedIn")}.property()})}(),function(){MyYoga.WorkoutController=Ember.ObjectController.extend({mine:function(){var a=this.get("user")&&"function"==typeof this.get("user").get?this.get("user").get("id"):this.get("user");return MyYoga.MyUser.get("user").get("id")===a?!0:!1}.property("user")})}(),function(){MyYoga.WorkoutDeleteController=Ember.ObjectController.extend({actions:{"delete":function(){var a=this.get("model");a.deleteRecord(),a.save(),this.transitionToRoute("workouts")}}})}(),function(){MyYoga.WorkoutsIndexController=Ember.ArrayController.extend({sortProperties:["date"],sortAscending:!1})}(),function(){MyYoga.WorkoutsNewController=Ember.ObjectController.extend({titleErrors:[],dateErrors:[],startTimeErrors:[],endTimeErrors:[],titleValid:!0,dateValid:!0,startTimeValid:!0,endTimeValid:!0,datePlaceholder:function(){return moment().format("LL")}.property("date"),startTimePlaceholder:function(){return moment().format("LT")}.property("date"),endTimePlaceholder:function(){return moment().add("h",1).format("LT")}.property("date"),formattedDate:function(){var a=this.get("date");return a?moment(a).format("D MMMM YYYY"):""}.property("date"),startTime:function(){var a=this.get("date");return a&&this.get("duration")?moment(a).format("LT"):""}.property("date"),endTime:function(){var a=this.get("date");return a&&this.get("duration")?(a=moment(a),a.add("s",this.get("duration")),a.format("LT")):""}.property("date","duration"),validateTitle:function(){this.set("titleErrors",[]),this.set("titleValid",!0);var a=this.get("title");"undefined"==typeof a||null!==a&&0!==a.length||(this.get("titleErrors").push("The workout title is required."),this.set("titleValid",!1))}.observes("title"),validateDate:function(){this.set("dateErrors",[]),this.set("dateValid",!0);var a=this.get("formattedDate");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("dateErrors").push("The workout date is required."),this.set("dateValid",!1),void 0;moment(a).isValid()||(this.get("dateErrors").push("Invalid date format."),this.set("dateValid",!1))}}.observes("date"),validateStartTime:function(){this.set("startTimeErrors",[]),this.set("startTimeValid",!0);var a=this.get("startTime");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("startTimeErrors").push("The workout start time is required."),this.set("startTimeValid",!1),void 0;var b=moment(this.get("startTime"),"h:i A").isValid(),c=moment(this.get("formattedDate")+" "+this.get("startTime")).isValid();b||c||(this.get("startTimeErrors").push("Invalid time format."),this.set("startTimeValid",!1))}}.observes("startTime"),validateEndTime:function(){this.set("endTimeErrors",[]),this.set("endTimeValid",!0);var a=this.get("endTime");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("endTimeErrors").push("The workout end time is required."),this.set("endTimeValid",!1),void 0;var b=moment(this.get("endTime"),"h:i A").isValid(),c=moment(this.get("formattedDate")+" "+this.get("endTime")).isValid();b||c||(this.get("endTimeErrors").push("Invalid time format."),this.set("endTimeValid",!1))}}.observes("endTime"),isValid:function(){this.validateTitle(),this.validateDate(),this.validateStartTime(),this.validateEndTime();var a=this.get("titleValid")&&this.get("dateValid")&&this.get("startTimeValid")&&this.get("endTimeValid");return a=a&&"undefined"!=typeof this.get("title"),a=a&&"undefined"!=typeof this.get("formattedDate"),a=a&&"undefined"!=typeof this.get("startTime"),a=a&&"undefined"!=typeof this.get("endTime")}.property("titleValid","dateValid","startTimeValid","endTimeValid"),actions:{saveWorkout:function(){if(this.get("isValid")){var a,b=moment(this.get("formattedDate")+" "+this.get("startTime")),c=moment(this.get("formattedDate")+" "+this.get("endTime"));this.get("id")?(a=this.get("model"),a.set("title",this.get("title")),a.set("date",new Date(b.toISOString())),a.set("duration",c.unix()-b.unix()),a.set("notes",this.get("notes"))):a=this.store.createRecord("workout",{title:this.get("title"),date:new Date(b.toISOString()),duration:c.unix()-b.unix(),notes:this.get("notes"),user:MyYoga.MyUser.get("user")}),a.save(),this.transitionToRoute("workouts")}}}})}(),function(){MyYoga.Store=DS.Store.extend({revision:1}),MyYoga.ApplicationSerializer=DS.RESTSerializer.extend({primaryKey:"_id"}),DS.RESTAdapter.reopen({namespace:MyYoga.get("apiVersion")})}(),function(){MyYoga.User=DS.Model.extend({name:DS.attr("string"),workouts:DS.hasMany("workout")})}(),function(){MyYoga.Workout=DS.Model.extend({title:DS.attr("string"),date:DS.attr("date"),duration:DS.attr("number"),notes:DS.attr("string"),user:DS.belongsTo("user"),workoutLength:function(){return moment.duration(this.get("duration"),"seconds").humanize()}.property("duration"),formattedDate:function(){return moment(this.get("date")).format("lll")}.property("date")})}(),function(){MyYoga.LoginRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")?this.transitionTo("index"):window.location="/"+MyYoga.get("apiVersion")+"/auth/twitter"}})}(),function(){MyYoga.WorkoutDeleteRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")}})}(),function(){MyYoga.WorkoutEditRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")},setupController:function(a,b){this.controllerFor("workouts.new").set("model",b)},renderTemplate:function(){this.render("workouts/new")}})}(),function(){MyYoga.WorkoutIndexRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")}})}(),function(){MyYoga.WorkoutsIndexRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("workout")}})}(),function(){MyYoga.WorkoutsMineRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("workout",{user:MyYoga.MyUser.get("uid")})},renderTemplate:function(a){this.render("workouts/index",{controller:a})}})}(),function(){MyYoga.WorkoutsNewRoute=Ember.Route.extend({beforeModel:function(){MyYoga.MyUser.get("loggedIn")||this.transitionTo("login")},setupController:function(a){a.set("model",{})}})}(),function(){MyYoga.WorkoutsNewView=Ember.View.extend({didInsertElement:function(){var a=this;a.$(".datepicker").pickadate(),a.$(".timepicker").pickatime({interval:15}),a.endPicker=a.$("#end .timepicker").pickatime("picker")},resetEnd:function(){if(this.endPicker){var a=this.get("controller").get("startTime");a&&(a=moment(a,"LT"),this.endPicker.set("min",[a.format("H"),a.format("m")]))}}.observes("controller.startTime")})}(),function(){MyYoga.Router.map(function(){this.resource("workouts",function(){this.route("mine"),this.route("new"),this.resource("workout",{path:"/:workout_id"},function(){this.route("edit"),this.route("delete")})}),this.route("login")})}(),function(){MyYoga.Auth=Ember.Object.extend({uid:null,user:null,loggedIn:function(){return this.user&&this.user.get("id")?!0:!1}.property("user"),init:function(){this._super(),this.set("uid",jQuery.cookie("uid"))}})}();