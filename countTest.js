MyColl = new Mongo.Collection("something");

if (Meteor.isClient) {
  Meteor.subscribe("something", 4);
  Session.set("countingSomething", "counting");
  Template.body.helpers({
    "countSomething": function() {
      Meteor.call("countSomething", function(error, result) {
        if (error) {
          Session.set("countingSomething", "I cant Count that!");
        }
        if (result) {
          Session.set("countingSomething", result);
        }
      });
      return Session.get("countingSomething");
    },
    "get4Element": function() {
      return MyColl.findOne({
        counting: 4
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("something", function(argument) {
    if (argument) {
      return MyColl.find({
        counting: argument
      });
    }
  });
  Meteor.methods({
    countSomething: function() {
      return MyColl.find({}).count();
    }
  });
  Meteor.startup(function() {
    if (MyColl.find({}).count() < 1) {
      for (var i = 0; i < 100000; i++) {
        MyColl.insert({
          counting: i
        });
      }
    }
  });
}
