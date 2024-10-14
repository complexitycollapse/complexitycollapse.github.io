# Tinderbox

Tinderbox is a visual knowledge management/note taking application inspired by things like zettelkasten and mind maps. Arguably it's a hypertext system. Either way its exactly what I want my hypertext system to do.

## How it works

### Notes and Attributes

There is a notes field on the left and a text area on the right. **Notes** have a title, text and can contain other notes. Notes visually change if they have contents (you can see the contents in some circumstances). Notes containing other notes are known as containers.

Notes **link** to other notes. Each note has a list of incoming and outgoing links.

Note the similarity to Xanadu: there are two kinds of structure, the hierarchical structure of notes and the links between them.

Notes have **attributes**, which allow them to act like records. Each note has a set of visible attributes, but it theoretically has every attribute in the system. Attributes are sorted into categories to make them manageable. There are system attributes, some of which are read-only. All the visual styling is done through attributes. Users can also creat their own attributes. Attributes are typed. Types are: string, number, date, colour, boolean, file, url, list, set (no duplicate list), interval.

A **root** note is one that has no parent. Not sure whether the document itself is the root or any note at the top level is a root. I think it depends as more than just Tinderbox uses this format.

Every note has a unique **ID**.

### Views

You can choose from different **views**. 

 - The map view shows notes spacially arranged.
 - Outline view shows the hierarchy of notes. It looks very much like a standard highlighting tool.
 - Chart view - a tree chart of the hierarchical structure of the notes.
 - Table view - lists notes with attributes as column headings.
 - Hyperbolic view - a spider diagram showing links between notes, with more distant notes shrinking in size.
 - Timeline view - displays notes on a timeline, occupying space as determined by their StartDate and EndData. Can have multiple bands, with notes assigned to bands using the TimelineBand attribute.
 - Attribute browser view - shows notes categorised by attribute value.
 - ...more

You can double-click on a note to change the view to what it contains. There are breadcrumbs along the top that let you know where you are.

### Prototypes and Attribute Inheritance

You can create **prototypes** which act as templates for other notes. You can change the prototype of an existing note. I think prototypes are nothing more than notes that you keep in the prototype container. (No, there's a prototype attribute you can set, but perhaps notes created in the prototypes container have that set by default). Attributes are inhereted from the prototype similarly to Javascript. However, some attributes are **intrinsic** meaning they are never inherited. Examples are the X and Y position, ID, Outline order. Some intrinsic attribute values on the prototype are copied to the instance (height and width) so that the initial value is the same.

A note can be "reset", meaning that its local properties are wiped, restoring it to the prototype. Intrinsic properties are not wiped.

Prototypes are not the only place that values are inherited from. There is a cascade: OS settings (mostly localization stuff, such as date formats), built-in app settings, config files, document settings, prototypes (to any level of inheritance), note.

### Agents and Actions

**Agents** can be used to create dynamic notes. An agent can be given a query, and the results appear as its contents. Queries consume the attributes of the notes. The query is an attribute, of course. Agents can also have actions, which allow them to set an attribute value on anything that matches the query.

The notes that appear in an agent are **aliases**, basically clones in the ZigZag sense. The alias can be edited as if it were the original. An alias is implemented as a note with the original as its prototype, and a special hidden attribute: alias=true.

**Queries, actions, rules and edicts** can be set on any note, icluding on a prototype. They all seem to do the same thing but run at different times. Agent actions run continually.

Some more details: agent actions are performed on an alias is creates as a result of a query match; a rule is performed by a note or agent on itself every few seconds; an edict is the same but runs approximately once an hour; other actions are performed on certain events e.g. OnAdd, OnRemove, OnJoin.

A **stamp** is a named action that is run manually on any selected nodes.

Action code is written in a language that supports a wide variety of predicates, conditional statements, and sequences of actions. There is also support for regexes.

Agents as just like notes but have a hidden Agent=true attribute. Aliases are stored as children of the agent, just like notes nested in notes.

### Paths

**Paths*** are used in scripting. Paths look like file paths: /news, ../Chicago, ../.. etc. Each path designates a note. The labels are the names of the notes.

Note names are not required to be unique. The first note in the outline order is used when that's so. This is a general principle used elsewhere.

### HTML

You can put HTML in the text of a node. This HTML can contain variables that refer to the note's attributes, so the text can format the attribute. The HTML is therefore a bit like a template. Conditional expressions are allowed too, and no doubt all the other scripting things.

### Inspector

This is a UI concept. The inspector is a window that gives you control over most aspects of *something*. That something is what was selected before you open it. That could be a note, an arbitrary group of notes, the document itself or Tinderbox. The are several different inspectors, each of which is only applicable to certain selection.

Its basic role is to allow you to modify attributes at some level. But it provides specialised tabs for important attributes, rather than just a list. For example, there's a colours tab a document level that allows you to name colours, and has a colour wheel. Inspectors differ by which tabs they offer.

The inspectors are: Tinderbox, document, properties, appearance, text, export, action. All but the first two apply to notes and selections of notes. (https://acrobatfaq.com/atbref10/index/Windows/Inspector.html). Note that the text inspector is not for editing the note's text, but for modifying how it's displayed (font, colour etc.)

### Adornments

Adornments are visual containers within a container that you can place child notes in for visual purposes. The note remains a child of its parent, not the adornment. Adornments have many of the features of agents, such as queries and actions. The difference is that notes are actually relocated to the adornment (and therefore their parent becomes the container of the adornment) rather than using aliases. So adornments give you a kind of self-organization.

This is interesting because adornments represent a layer of hierarchy that is both within and without the general hierarchy, demonstrating multiple meanings of "contained by". Visual layout of a hypertext document might be similar, with both visual containers and multiple containeres, and multiple paths of inheritance.

## Good Points

 - Notes are visual yet abstract. Every note has many different visual representations, depending on the view used.
 - Hierarchical notes allows any note to grow to unlimited complexity.
 - Multiple visual views (overlays?) on the same data.
 - Notes have two kinds of "contents", the text within them and the notes they contain.
 - There are also two fundamental kinds of structure: hierarchical (contents) and links.
 - Notes have different kinds of relations to other notes. For example, the spacial arrangement in the map view vs. the ordering in the outline view.
 - Simple data model: notes, attributes, links. (More advanced: prototypes, aliases, agents).
 - Dynamic queries (they query within the document, this can be extended in many ways).
 - Scripting language that isn't a full language (not loops).
 - Data format is simple and can be processed by other tools.
 - Persistent IDs for all notes.
 - Implicit ordering of all content via the outline view.
 - Adornments demonstrate multiple, semi-nested forms of containment.

## Not So Good Points

 - The way agents work seems very imperative.
 - Rules and edicts run periodically. Rather strange.

## Links

 - [Homepage](http://www.eastgate.com/)
 - [File Format Reference](https://acrobatfaq.com/atbref10/index/Syntax_Library/The_XML_TBX_format.html)

### Beck Tench

Tinderbox power user.

 - [YouTube](https://www.youtube.com/@beck-tench)
 - [Blog](https://www.becktench.com/blog)
 - [Workflow](https://www.becktench.com/workflow)

### Michael Becker

Tinderbox trainer.

 - [Mastering Tinderbox and the 5Cs of Knowledge Management](https://www.youtube.com/watch?v=AQCp8tVRJSg&list=PL6MVDtSfcKxd2XLpenMAd9H4VknDyn6oz)

### Mark Anderson

 - [Tutorials](https://www.acrobatfaq.com/tb_clarify/index.html)
 - [Tinderbox Reference](https://acrobatfaq.com/atbref10/)
