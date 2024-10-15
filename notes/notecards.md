# NoteCards

Created Tuesday 02 July 2024

<https://ics.uci.edu/~redmiles/ics227-SQ04/papers/Hypertext/Secondary/p836-halasz.pdf>

This is a really interesting discussion of what hypertext needs to do in the future.
The way it worked: basic cards contained content (there were a few different types for different kinds of content), links connected cards, browsers were cards that displayed a collection of other cards and the links between them, and fileboxes were directories of cards (including other file boxes).

## 1. Search and Query in a Hypertext Network

Navigation by following links is a defining feature of hypertext. But navigational access is not sufficient. Query access is also required. This is because large, heterogenous networks are hard to navigate. It's difficult to find what you want and easy to get lost.

Two kinds are required: content search and structure search. Content search just looks through the content, treated as a homogenous mass. Structure search allows you to find subnetworks that match a particular pattern. e.g. all subnetworks containing two nodes connected by a supports link, where the destination node contains the word “hypertext.”; a circular structure containing a node that is indirectly linked to itself via an unbroken sequence of “supports” links. "This query could be used, for example, to find circular arguments."

What would a structure query language look like? Perhaps like regular expressions, but converted to work on arbitrary network patterns (i.e. non-linear regular expressions). It would need the usual regular expression operators (alternation, grouping etc.) plus a way to express "forking": "e.g., an operator with N regular expression arguments which states that the next entity in the network being matched must be N, not necessarily distinct, structures each of which matches one of the argument expressions."

To make this accessible, a visual format may be required, e.g.:
![graphical query](/assets/images/Notecards-graphical-query.png)

## 2. Composites

There needs to be some way of representing and dealing with groups of cards and links as unique entities separate from their contents. This requires links (or some other mechanism) that expresses *inclusion* relations between entities, rather that the *reference* relations that links are usually used for. Inclusion relations imply a part/whole relationship, in which operations on the whole also affect the parts. Reference implies a looser relationship in which entities remain independent.

An example of where this would be useful would be having chapters that make up a document. It would be useful to be able to zoom in and out on parts of such a structure, like an outline processor does. 

Browsers and file boxes should be modified to use inclusion relations. Currently they use ordinary links.

Outstanding questions: do links refer to a node per se or can they refer to a node as it exists within the context of a given composite? Does a new version of an included node necessarily imply a new version of the composite? Should composites be implemented using specialised links or another mechanism?

## 3. Virtual Structures for Dealing with Changing Information

Static hypermedia structures are defined extensionally, by the exact identity of their components. Virtual structures are defined intentionally, by specifying a description of their components e.g. "a subnetwork containing all nodes created by someone other than me in the last three days". This is similar to views in relational databases. They are likewise constructed using queries. (Although presumably there could also be some kind of transformation of the results, as also done with views).

All operations possible on a base hypermedia entity should be possible on virtual structures too. This includes modification.

Browsers could be constructed as virtual composites.

Links could also be virtual. They could specify their ends by a mix of static and virtual means. Conditional links, which can point to one destination or another depending on a predicate, have also been requested. ZOG contains a kind of conditional link: mavigational links that connect the displayed node to the previous one visited.

## 4. Computation Over Hypermedia Networks

NoteCards has an API that allows nodes to be created and retrieved by program. This allows computation, but it isn't particularly integrated into the system.

Hypermedia systems, frame-based systems and object-based systems have nearly identical data models. 

NoteCards could be transformed into a knowledge-based system by adding a computation engine that makes inferences from the information stored in the network, similar to an expert system.

## 5. Versioning

Neptune provides time-based linear versioning for nodes and links. It also allows versions to be forked. Intermedia allows there to be multiple versions of the web of links that connects documents. PIE has linear versions for each entity and for changes to the hypermedia network considered as a whole. 

Versions do not have to be linear. At the most general they are a directed acyclic graph.

Both versions and deltas between versions should be addressable entities in the system (deltas would be virtual entities). Ideally it should be possible to annotate and reference deltas (not reallly necessary, not even git does this as the annotation goes on the version, not the delta).

Versions create interesting problems for referencing: "In particular, a reference to an entity may refer to a specific version of that entity, to the newest version of that entity, to the newest version of that entity along a specific branch of the version graph, or to the (latest) version of the entity that matches some particular description (query). " This is a particularly important issue for links and composites. "updating the spelling of a few words in a paragraph may not require the creation of a new version of the document(s) containing that paragraph."

Versions of individual entities alone are not sufficient. A developer may want to refer to a coordinated change to a number of modules, and then several such versions would be collected together as a release. 

In general, the writer thinks this could work just like a VCS, and indeed envisages software being developed as hypermedia.

Another use: each user has their own private versions. The public network is the "base" and their changes are versions on top of that. At any point the changes could be applied to the public network. This is very, very much like git.

## 6. Collaboration

Multiple people should be able to edit a node simultaneously. Parties should be notified when certain events happen (RSS for hypermedia?) 

Collaborative activities that occur in a hypermedia network: substantive (actually creating stuff), annotative (commenting on other people's stuff) and procedural (discussions, decisions and other actions focusing on the use of the network and the procedures for collaboration).

Features that could support procedural activities: message posting areas, tracking and displaying the contributions made by each individual, recording decisions about usage conventions. 

Collaboration requires a new language. In particular, there need to be ways for explaining to the reader why a link should be followed (rhetoric of departure) and how the node arrived at relates the the context from which the user departed (rhetoric of arrival). These help users deal with documents that no longer have a linear ordering.

## 7. Extensibility and Tailorability

The primary means of extensibility in NoteCards is the ability to add new node and link types. However, this can only be achieved through the API and is very difficult for non-programmers. GNU Emacs and Apple Hypercard/Hypertalk have better extensibility and are worth studying. Both include an interpreter for a language designed around the objects and operations handled by the system. This has scalability: simple things can be done with simple commands and complex things with complex programs. 

## A General Observation

A useful concept would be "universes" of hypermedia. There's the public docuverse and then there could be private universes too, and also public ones. These would allow the scope of a query to be restricted (only search my universe).

This notion of "universe" may not be one concept. There may be many kinds of different grouping that are used for different purposes. Restricted searches are one exampleof where a "universe" is required. Different visibility/sharing levels may be an entirely different concept.
