!function(){var a=window.Yava=Ember.Application.create({apiVersion:"v1"});Ember.Application.initializer({name:"auth",after:"store",initialize:function(b){a.deferReadiness(),a.MyUser=a.Auth.create();var c=a.MyUser.get("uid");if(c){var d=b.lookup("store:main");d.find("user",c).then(function(b){a.MyUser.set("user",b),a.advanceReadiness()},function(){a.advanceReadiness()})}else a.advanceReadiness()}})}(),function(){Yava.ModalDialogComponent=Ember.Component.extend({actions:{close:function(){return this.sendAction()}}})}(),function(){Yava.ModalController=Ember.ObjectController.extend({actions:{close:function(){return this.send("closeModal")}}})}(),function(){Yava.AddLocationController=Yava.ModalController.extend({studios:[],init:function(){this._super(),navigator.geolocation.getCurrentPosition($.proxy(this.locFound,this),$.proxy(this.locError,this),{enableHighAccuracy:!0,timeout:2e3})},locFound:function(a){this.store.find("venue",{ll:a.coords.latitude+","+a.coords.longitude}).then($.proxy(this.addVenues,this),$.proxy(this.locError,this))},locError:function(){},addVenues:function(a){this.set("studios",a)},actions:{select:function(a){this.store.find("venue",a).then($.proxy(function(a){this.set("venue",a),this.send("closeModal")},this))}}})}(),function(){Yava.ApplicationController=Ember.Controller.extend({loggedIn:function(){return Yava.MyUser.get("loggedIn")}.property()})}(),function(){Yava.GoalDeleteController=Ember.ObjectController.extend({actions:{"delete":function(){var a=this.get("model");a.deleteRecord(),a.save(),this.transitionToRoute("goals")}}})}(),function(){Yava.GoalsNewController=Ember.ObjectController.extend({titleErrors:[],startErrors:[],endErrors:[],hoursTotalErrors:[],workoutsTotalErrors:[],titleValid:!0,startValid:!0,endValid:!0,hoursTotalValid:!0,workoutsTotalValid:!0,startPlaceholder:function(){return moment().format("D MMMM YYYY")}.property("start"),endPlaceholder:function(){return moment().format("D MMMM YYYY")}.property("end"),formattedStart:function(){return this.get("start")?moment(this.get("start")).format("D MMMM YYYY"):void 0}.property("start"),formattedEnd:function(){return this.get("end")?moment(this.get("end")).format("D MMMM YYYY"):void 0}.property("end"),validateTitle:function(){this.set("titleErrors",[]),this.set("titleValid",!0);var a=this.get("title");"undefined"==typeof a||null!==a&&0!==a.length||(this.get("titleErrors").push("The goal title is required."),this.set("titleValid",!1))}.observes("title"),validateStart:function(){this.set("startErrors",[]),this.set("startValid",!0);var a=this.get("formattedStart");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("startErrors").push("The start date is required."),this.set("startValid",!1),void 0;moment(a).isValid()||(this.get("startErrors").push("Invalid date format."),this.set("startValid",!1))}}.observes("start"),validateEnd:function(){this.set("endErrors",[]),this.set("endValid",!0);var a=this.get("formattedEnd");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("endErrors").push("The end date is required."),this.set("endValid",!1),void 0;moment(a).isValid()||(this.get("endErrors").push("Invalid date format."),this.set("endValid",!1))}}.observes("end"),isValid:function(){this.validateTitle(),this.validateStart(),this.validateEnd();var a=this.get("titleValid")&&this.get("startValid")&&this.get("endValid");return a=a&&"undefined"!=typeof this.get("title"),a=a&&"undefined"!=typeof this.get("formattedStart"),a=a&&"undefined"!=typeof this.get("formattedEnd"),a=a&&("undefined"!=typeof this.get("hoursTotal")||"undefined"!=typeof this.get("workoutsTotal"))}.property("titleValid","startValid","endValid"),actions:{saveGoal:function(){var a=this;if(a.get("isValid")){var b;a.get("id")?(b=a.get("model"),b.set("title",a.get("title")),b.set("start",moment(a.get("formattedStart")).toDate()),b.set("end",moment(a.get("formattedEnd")).toDate()),b.set("hoursTotal",a.get("hoursTotal")),b.set("workoutsTotal",a.get("workoutsTotal"))):b=a.store.createRecord("goal",{title:a.get("title"),start:moment(a.get("formattedStart")).toDate(),end:moment(a.get("formattedEnd")).toDate(),hoursTotal:a.get("hoursTotal"),workoutsTotal:a.get("workoutsTotal"),user:Yava.MyUser.get("user")}),b.save().then(function(){a.get("model").reset(),a.transitionToRoute("goals")},function(){})}}}})}(),function(){Yava.UserController=Ember.ObjectController.extend({since:function(){return moment(this.get("created")).format("MMMM YYYY")}.property("created")})}(),function(){Yava.WorkoutController=Ember.ObjectController.extend({mine:function(){var a=this.get("user")&&"function"==typeof this.get("user").get?this.get("user").get("id"):this.get("user");return Yava.MyUser.get("user").get("id")===a?!0:!1}.property("user")})}(),function(){Yava.WorkoutDeleteController=Ember.ObjectController.extend({actions:{"delete":function(){var a=this.get("model");a.deleteRecord(),a.save(),this.transitionToRoute("workouts")}}})}(),function(){Yava.WorkoutsIndexController=Ember.ArrayController.extend({page:1,disabled:!1,loading:!1,sortProperties:["date"],sortAscending:!1,find:function(){return this.store.find("workout",{page:this.get("page")})},actions:{loadMore:function(){var a=this;a.get("loading")||(a.set("loading",!0),a.find().then(function(b){if(b.get("length")){var c=a.get("page");c++,a.set("page",c)}else a.set("disabled",!0);a.set("loading",!1)},function(){a.set("loading",!1)}))}}})}(),function(){Yava.WorkoutsMineController=Yava.WorkoutsIndexController.extend({find:function(){return this.store.find("workout",{page:this.get("page"),user:Yava.MyUser.get("uid")})}})}(),function(){Yava.WorkoutsNewController=Ember.ObjectController.extend({titleErrors:[],dateErrors:[],startTimeErrors:[],endTimeErrors:[],titleValid:!0,dateValid:!0,startTimeValid:!0,endTimeValid:!0,datePlaceholder:function(){return moment().format("D MMMM YYYY")}.property("date"),startTimePlaceholder:function(){return moment().format("LT")}.property("date"),endTimePlaceholder:function(){return moment().add("h",1).format("LT")}.property("date"),formattedDate:function(){var a=this.get("date");return a?moment(a).format("D MMMM YYYY"):a}.property("date"),startTime:function(){var a=this.get("date");return a&&this.get("duration")?moment(a).format("LT"):""}.property("date"),endTime:function(){var a=this.get("date");return a&&this.get("duration")?(a=moment(a),a.add("s",this.get("duration")),a.format("LT")):""}.property("date","duration"),validateTitle:function(){this.set("titleErrors",[]),this.set("titleValid",!0);var a=this.get("title");"undefined"==typeof a||null!==a&&0!==a.length||(this.get("titleErrors").push("The workout title is required."),this.set("titleValid",!1))}.observes("title"),validateDate:function(){this.set("dateErrors",[]),this.set("dateValid",!0);var a=this.get("formattedDate");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("dateErrors").push("The workout date is required."),this.set("dateValid",!1),void 0;moment(a).isValid()||(this.get("dateErrors").push("Invalid date format."),this.set("dateValid",!1))}}.observes("date"),validateStartTime:function(){this.set("startTimeErrors",[]),this.set("startTimeValid",!0);var a=this.get("startTime");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("startTimeErrors").push("The workout start time is required."),this.set("startTimeValid",!1),void 0;var b=moment(this.get("startTime"),"h:i A").isValid(),c=moment(this.get("formattedDate")+" "+this.get("startTime")).isValid();b||c||(this.get("startTimeErrors").push("Invalid time format."),this.set("startTimeValid",!1))}}.observes("startTime"),validateEndTime:function(){this.set("endTimeErrors",[]),this.set("endTimeValid",!0);var a=this.get("endTime");if("undefined"!=typeof a){if(null===a||0===a.length)return this.get("endTimeErrors").push("The workout end time is required."),this.set("endTimeValid",!1),void 0;var b=moment(this.get("endTime"),"h:i A").isValid(),c=moment(this.get("formattedDate")+" "+this.get("endTime")).isValid();b||c||(this.get("endTimeErrors").push("Invalid time format."),this.set("endTimeValid",!1))}}.observes("endTime"),isValid:function(){this.validateTitle(),this.validateDate(),this.validateStartTime(),this.validateEndTime();var a=this.get("titleValid")&&this.get("dateValid")&&this.get("startTimeValid")&&this.get("endTimeValid");return a=a&&"undefined"!=typeof this.get("title"),a=a&&"undefined"!=typeof this.get("formattedDate"),a=a&&"undefined"!=typeof this.get("startTime"),a=a&&"undefined"!=typeof this.get("endTime")}.property("titleValid","dateValid","startTimeValid","endTimeValid"),actions:{saveWorkout:function(){if(this.get("isValid")){var a,b=moment(this.get("formattedDate")+" "+this.get("startTime")),c=moment(this.get("formattedDate")+" "+this.get("endTime"));this.get("id")?(a=this.get("model"),a.set("title",this.get("title")),a.set("date",b.toDate()),a.set("duration",c.unix()-b.unix()),a.set("notes",this.get("notes"))):a=this.store.createRecord("workout",{title:this.get("title"),date:b.toDate(),duration:c.unix()-b.unix(),notes:this.get("notes"),user:Yava.MyUser.get("user")}),a.save(),this.transitionToRoute("workouts")}}}})}(),function(){Yava.Store=DS.Store.extend({revision:1}),Yava.ApplicationSerializer=DS.RESTSerializer.extend({primaryKey:"_id"}),DS.RESTAdapter.reopen({namespace:Yava.get("apiVersion")})}(),function(){Yava.Goal=DS.Model.extend({title:DS.attr("string"),start:DS.attr("date"),end:DS.attr("date"),complete:DS.attr("boolean"),hoursTotal:DS.attr("number"),hoursProgress:DS.attr("number"),workoutsTotal:DS.attr("number"),workoutsProgress:DS.attr("number"),user:DS.belongsTo("user"),percent:function(){var a=0;return a=this.get("hoursTotal")?this.get("hoursProgress")/this.get("hoursTotal"):this.get("workoutsProgress")/this.get("workoutsTotal"),a=Number(100*a),a>100&&(a=100),a}.property("hoursTotal","hoursProgress","workoutsTotal","workoutsProgress"),percentStyle:function(){return"width: "+this.get("percent")+"%"}.property("percent"),total:function(){return this.get("hoursTotal")?this.get("hoursTotal"):this.get("workoutsTotal")}.property("workoutsTotal","hoursTotal"),progress:function(){var a=0;return a=this.get("hoursTotal")?this.get("hoursProgress"):this.get("workoutsProgress"),Number(a)}.property("workoutsProgress","hoursProgress"),unit:function(){return this.get("hoursTotal")?"hours":"workouts"}.property("hoursTotal"),formattedStart:function(){return moment(this.get("start")).format("lll")}.property("start"),formattedEnd:function(){return moment(this.get("end")).format("lll")}.property("end")})}(),function(){Yava.Stat=DS.Model.extend({weekHours:DS.attr("number"),weekWorkouts:DS.attr("number"),monthHours:DS.attr("number"),monthWorkouts:DS.attr("number"),yearHours:DS.attr("number"),yearWorkouts:DS.attr("number"),allHours:DS.attr("number"),allWorkouts:DS.attr("number"),user:DS.belongsTo("user"),formattedWeekHours:function(){return moment.duration(this.get("weekHours"),"seconds").asHours()}.property("duration"),formattedMonthHours:function(){return moment.duration(this.get("monthHours"),"seconds").asHours()}.property("duration"),formattedYearHours:function(){return moment.duration(this.get("yearHours"),"seconds").asHours()}.property("duration"),formattedAllHours:function(){return moment.duration(this.get("allHours"),"seconds").asHours()}.property("duration")})}(),function(){Yava.User=DS.Model.extend({name:DS.attr("string"),created:DS.attr("date"),lastLogin:DS.attr("date"),photo:DS.attr("string"),workouts:DS.hasMany("workout"),stats:DS.belongsTo("stat")})}(),function(){Yava.Venue=DS.Model.extend({location:DS.attr(),name:DS.attr("string")})}(),function(){Yava.Workout=DS.Model.extend({title:DS.attr("string"),date:DS.attr("date"),duration:DS.attr("number"),notes:DS.attr("string"),user:DS.belongsTo("user"),venue:DS.belongsTo("venue"),workoutLength:function(){return moment.duration(this.get("duration"),"seconds").humanize()}.property("duration"),formattedDate:function(){return moment(this.get("date")).format("lll")}.property("date")})}(),function(){Yava.ApplicationRoute=Ember.Route.extend({actions:{openModal:function(a,b){return this.controllerFor(a).set("model",b),this.render(a,{into:"application",outlet:"modal"})},closeModal:function(){return this.disconnectOutlet({outlet:"modal",parentView:"application"})}}})}(),function(){Yava.GoalDeleteRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("goal")}})}(),function(){Yava.GoalIndexRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("goal")}})}(),function(){Yava.GoalsIndexRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("goal",{user:Yava.MyUser.get("uid"),endsAfter:moment().toISOString()})},renderTemplate:function(a){this.render("goals/index",{controller:a})}})}(),function(){Yava.GoalsNewRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},setupController:function(a){a.set("model",{})}})}(),function(){Yava.LoginRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")?this.transitionTo("index"):window.location="/"+Yava.get("apiVersion")+"/auth/twitter"}})}(),function(){Yava.LogoutRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")?(Yava.MyUser.destroy(),window.location="/"+Yava.get("apiVersion")+"/logout"):this.transitionTo("index")}})}(),function(){Yava.PastAttemptedRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("goal",{user:Yava.MyUser.get("uid"),endsBefore:moment().toISOString(),complete:!1})},renderTemplate:function(a){this.render("goals/index",{controller:a})}})}(),function(){Yava.PastCompletedRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("goal",{user:Yava.MyUser.get("uid"),endsBefore:moment().toISOString(),complete:!0})},renderTemplate:function(a){this.render("goals/index",{controller:a})}})}(),function(){Yava.PastIndexRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("goal",{user:Yava.MyUser.get("uid"),endsBefore:moment().toISOString()})},renderTemplate:function(a){this.render("goals/index",{controller:a})}})}(),function(){Yava.UserRoute=Ember.Route.extend({})}(),function(){Yava.WorkoutDeleteRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")}})}(),function(){Yava.WorkoutEditRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")},setupController:function(a,b){this.controllerFor("workouts.new").set("model",b)},renderTemplate:function(){this.render("workouts/new")}})}(),function(){Yava.WorkoutIndexRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.modelFor("workout")}})}(),function(){Yava.WorkoutsIndexRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("workout")}})}(),function(){Yava.WorkoutsMineRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.find("workout",{user:Yava.MyUser.get("uid")})},renderTemplate:function(a){this.render("workouts/index",{controller:a})}})}(),function(){Yava.WorkoutsNewRoute=Ember.Route.extend({beforeModel:function(){Yava.MyUser.get("loggedIn")||this.transitionTo("login")},model:function(){return this.store.createRecord("workout")},setupController:function(a){a.set("model",{})}})}(),function(){Yava.GoalsNewView=Ember.View.extend({didInsertElement:function(){var a=this;a.$(".datepicker").pickadate(),a.$(".timepicker").pickatime({interval:15}),a.endPicker=a.$("#end .timepicker").pickatime("picker")},isSelected:function(){return this.get("controller").get("hoursTotal")||this.get("controller").get("workoutsTotal")?this.get("controller").get("hoursTotal")?"1":"0":"1"}.property("controller.hoursTotal","controller.workoutsTotal"),isHoursGoal:function(){return"1"===this.get("isSelected")?!0:!1}.property("isSelected"),resetEnd:function(){if(this.endPicker){var a=this.get("controller").get("startTime");a&&(a=moment(a,"LT"),this.endPicker.set("min",[a.format("H"),a.format("m")]))}}.observes("controller.startTime")})}(),function(){Ember.RadioButton=Ember.View.extend({tagName:"input",type:"radio",attributeBindings:["name","type","value","checked:checked:"],click:function(){this.set("selection",this.$().val())},checked:function(){return this.get("value")===this.get("selection")}.property()})}(),function(){Yava.WorkoutsNewView=Ember.View.extend({didInsertElement:function(){var a=this;a.$(".datepicker").pickadate(),a.$(".timepicker").pickatime({interval:15}),a.endPicker=a.$("#end .timepicker").pickatime("picker")},resetEnd:function(){if(this.endPicker){var a=this.get("controller").get("startTime");a&&(a=moment(a,"LT"),this.endPicker.set("min",[a.format("H"),a.format("m")]))}}.observes("controller.startTime")})}(),function(){Yava.Router.map(function(){this.resource("goals",function(){this.route("new"),this.resource("past",function(){this.route("attempted"),this.route("completed")}),this.resource("goal",{path:"/:goal_id"},function(){this.route("delete")})}),this.resource("user",{path:"/users/:user_id"}),this.resource("workouts",function(){this.route("mine"),this.route("new"),this.resource("workout",{path:"/:workout_id"},function(){this.route("edit"),this.route("delete")})}),this.route("login"),this.route("logout")})}(),function(){Yava.Auth=Ember.Object.extend({uid:null,user:null,loggedIn:function(){return this.user&&this.user.get("id")?!0:!1}.property("user"),init:function(){this._super(),this.set("uid",jQuery.cookie("uid"))},destroy:function(){this._super(),jQuery.removeCookie("uid")}})}();