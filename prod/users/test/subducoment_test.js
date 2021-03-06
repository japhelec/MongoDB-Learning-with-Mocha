const assert = require("assert");
const User = require("../src/user");

describe("Subdocuments", () => {
  it("it can create a subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "PostTitle" }, { title: "HelloWorld" }],
    });
    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts[0].title === "PostTitle");
        assert(user.posts[1].title === "HelloWorld");
        done();
      });
  });

  it("Can add subdocuments to an existing record", (done) => {
    const joe = new User({ name: "Joe", posts: [] });
    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        user.posts.push({ title: "New Post" });
        return user.save();
      })
      .then(() => {
        return User.findOne({ name: "Joe" });
      })
      .then((user) => {
        assert(user.posts[0].title === "New Post");
        done();
      });
  });

  it("Add subdocuments to an existing record through array update operator", (done) => {
    const joe = new User({ name: "Joe", posts: [] });
    joe
      .save()
      .then(() => {
        return User.findOneAndUpdate(
          { name: "Joe" },
          { $push: { posts: { title: "New Post" } } }
        );
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts[0].title === "New Post");
        done();
      });
  });

  it("can remove an existing subdocuments", (done) => {
    const joe = new User({ name: "Joe", posts: [{ title: "New Post" }] });
    joe.save().then(() => {
      return User.findOneAndUpdate(
        { name: "Joe" },
        { $pull: { posts: { title: "New Post" } } }
      )
        .then(() => {
          return User.findOne({ name: "Joe" });
        })
        .then((user) => {
          assert(user.posts.length === 0);
          done();
        });
    });
  });
});
