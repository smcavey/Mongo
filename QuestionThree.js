//                             BOOKS
//                  |------PROGRAMMING----------|
//             LANGUAGES                |---DATABASES---|
//                                     MONGODB         dbm
db.createCollection('categories')
db.categories.insertMany([{
	"_id": "Books",
	"parent": null
},
{
	"_id": "Programming",
	"parent": "Books"
},
{
	"_id": "Languages",
	"parent": "Programming"
},
{
	"_id": "Databases",
	"parent": "Programming"
},
{
	"_id": "MongoDB",
	"parent": "Databases"
},
{
	"_id": "dbm",
	"parent": "Databases"
}])
//question3.1 query to report the ancestors of 'MongoDB' including levels incrementing towards root
var stack = []
var ancestors = []
var level = 1
stack.push("MongoDB")
while(stack.length > 0){
	var current = stack.pop()
	var parent = db.categories.findOne({ // only works when using findOne() instead of find() for some reason
		"_id": current
	}).parent // get parent field of current
	if(parent != null){
		stack.push(parent)
		var entry = {}
		entry["Name: " + parent] = "Level: " + level
		level++
		ancestors.push(entry)
	}
}
ancestors
//question3.2 given the root node "Books": report the height of the tree
var height = 1
var maxHeight = 1
var getHeight = function(node){
	var children = db.categories.find({"parent": node})
	if(children.hasNext()){
		height++
		while(children.hasNext()){
			var child = children.next()._id
			getHeight(child) // recursively get children when another child exists per child
		}
	    height--
	}
	else{
		if(height > maxHeight){
			maxHeight = height // update maxHeight with the deepest level we've recursively found
		}
	}
	return maxHeight
}
var height = getHeight("Books")
height
//question3.3 get all descendents of "Books" in an array using child references instead of parent
//create a new collection with children references instead of parents out of convenience to make new
//over updating each entry with a children field
db.createCollection("newcat")
db.newcat.insertMany([{
	"_id": "MongoDB",
	"children": []
},
{
	"_id": "dbm",
	"children": []
},
{
	"_id": "Databases",
	"children": ["MongoDB", "dmb"]
},
{
	"_id": "Languages",
	"children": []
},
{
	"_id": "Programming",
	"children": ["Databases", "Languages"]
},
{
	"_id": "Books",
	"children": ["Programming"]
}])
var stack = []
var booksChildren = []
stack.push("Books")
while(stack.length > 0){
	try{
		var current = stack.pop()
		// error thrown trying to find children of "dbm" and "MongoDB" instead of an empty arr getting returned
		// catch and continue bypasses this
		var children = db.newcat.findOne({"_id": current}).children
		if(children.length > 0){
			for(var i in children){
				stack.push(children[i])
			booksChildren.push(children[i])
			}
		}
	} catch(TypeError){
		continue
	}
}
booksChildren