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
print(ancestors)
//question3.2 given the root node "Books": report the height of the tree