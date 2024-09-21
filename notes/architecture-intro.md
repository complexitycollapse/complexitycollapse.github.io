# Architecture Introduction

Here are some requirements for a true hypertext system:

 - Support linear documents that can be read from beginning to end
 - Allow hierarchical structures that can be navigated logically (e.g. via a table of contents) or linearly (reading from start to finish)
 - Support non-linear documents that can be navigated in almost any fashion imaginable (essentially graphs)
 - Allow a document to have *multiple* of the aforementioned structures *simultaneously*
 - Make the document dynamic (without a scripting language) so these structures can be transformed by the user in a controlled fashion
 - Interlink documents so that you can navigate *between* them (and parts of them) arbitrarily
 - Allow documents to be seen from different *perspectives*, each one arranging the information in a different way for a different purpose
 - Allow the user to view, navigate and edit the document via any one of these structures or perspectives, or via a perspective of their own making

At first, as you start from the top of this list, a hypertext document seems like a reasonably solid thing. But as you work your way down, it becomes progressively less... objective. It starts becoming ever more fluid, ever more subjective, until by the end it's like nothing at all. It has no solidity anymore.

How on earth do you explain that to a computer?

This is a question with a long history and many previous answers. One of those answers even has its own Wikipedia entry ([Enfilade (Xanadu)](https://en.wikipedia.org/wiki/Enfilade_(Xanadu))). 

One thing is clear - absolutely nothing like this exists at present in any application or computing system. Every structure or datatype of existing programming languages is unsuited to the task. A hierarchy is no good. An object graph is no good. A relational database is no good.

But it only has to be implemented once, and then everyone will be able to use it.
