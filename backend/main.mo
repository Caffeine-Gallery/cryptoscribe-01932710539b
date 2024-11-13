import Func "mo:base/Func";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor {
    // Define the Post type
    type Post = {
        title: Text;
        body: Text;
        author: Text;
        timestamp: Time.Time;
    };

    // Use a stable variable to store posts
    stable var posts : [Post] = [];

    // Function to add a new post
    public shared(msg) func addPost(title: Text, body: Text, author: Text) : async () {
        let newPost : Post = {
            title = title;
            body = body;
            author = author;
            timestamp = Time.now();
        };
        posts := Array.append<Post>(posts, [newPost]);
    };

    // Function to get all posts
    public query func getPosts() : async [Post] {
        // Return posts in reverse chronological order
        Array.reverse(posts)
    };
};
