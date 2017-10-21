// Type definitions for postcss-selector-parser 2.2.3
// Definitions by: Chris Eppstein <chris@eppsteins.net>

/*~ Note that ES6 modules cannot directly export callable functions.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
export = parser;

/*~ This example shows how to have multiple overloads for your function */
declare function parser(processor?: (parser: parser.Parser) => void): parser.Processor;

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block. Often you will want to describe the
 *~ shape of the return type of the function; that type should
 *~ be declared in here, as this example shows.
 */
declare namespace parser {
    const TAG: "tag";
    const STRING: "string";
    const SELECTOR: "selector";
    const ROOT: "root";
    const PSEUDO: "pseudo";
    const NESTING: "nesting";
    const ID: "id";
    const COMMENT: "comment";
    const COMBINATOR: "combinator";
    const CLASS: "class";
    const ATTRIBUTE: "attribute";
    const UNIVERSAL: "universal";

    interface NodeTypes {
        tag: Tag,
        string: String,
        selector: Selector,
        root: Root,
        pseudo: Pseudo,
        nesting: Nesting,
        id: Identifier,
        comment: Comment,
        combinator: Combinator,
        class: ClassName,
        attribute: Attribute,
        universal: Universal
    }

    type Node = NodeTypes[keyof NodeTypes];

    function isNode(node: any): node is Node;

    interface Options {
        lossless: boolean;
    }
    class Processor {
        res: Root;
        readonly result: String;
        process(selectors: string, options?: Options): Processor;
    }
    interface ParserOptions {
        css: string;
        error: (e: Error) => void;
        options: Options;
    }
    class Parser {
        input: ParserOptions;
        lossy: boolean;
        position: number;
        root: Root;
        selectors: string;
        current: Selector;
      constructor(input: ParserOptions);
      loop(): Root;
    }
    interface NodeSource {
        start?: {
            line: number,
            column: number
        },
        end?: {
            line: number,
            column: number
        }
    }
    interface NodeOptions<Value = string> {
        value: Value;
        spaces?: {
            before: string;
            after: string;
        }
        source?: NodeSource;
    }
    interface Base<Value extends string | undefined = string> {
        type: keyof NodeTypes;
        parent?: Selector;
        value: Value;
        spaces?: {
            before: string;
            after: string;
        }
        source?: NodeSource;
        remove(): Node;
        replaceWith(...nodes: Node[]): Node;
        next(): Node;
        prev(): Node;
        clone(opts: {[override: string]:any}): Node;
        toString(): string;

    }
    interface ContainerOptions extends NodeOptions {
        nodes?: Array<Node>;
    }
    interface Container<Value extends string | undefined = string> extends Base<Value> {
        nodes: Array<Node>;
        append(selector: Selector): Container;
        prepend(selector: Selector): Container;
        at(index: number): Node;
        index(child: Node): number;
        readonly first: Node;
        readonly last: Node;
        readonly length: number;
        removeChild(child: Node): Container;
        removeAll(): Container;
        empty(): Container;
        insertAfter(oldNode: Node, newNode: Node): Container;
        insertBefore(oldNode: Node, newNode: Node): Container;
        each(callback: (node: Node) => boolean | void): boolean | undefined;
        walk(callback: (node: Node) => boolean | void): boolean | undefined;
        walkAttributes(callback: (node: Node) => boolean | void): boolean | undefined;
        walkClasses(callback: (node: Node) => boolean | void): boolean | undefined;
        walkCombinators(callback: (node: Node) => boolean | void): boolean | undefined;
        walkComments(callback: (node: Node) => boolean | void): boolean | undefined;
        walkIds(callback: (node: Node) => boolean | void): boolean | undefined;
        walkNesting(callback: (node: Node) => boolean | void): boolean | undefined;
        walkPseudos(callback: (node: Node) => boolean | void): boolean | undefined;
        walkTags(callback: (node: Node) => boolean | void): boolean | undefined;
        split(callback: (node: Node) => boolean): [Node[], Node[]];
        map(callback: (node: Node) => Node): Node[];
        reduce<T>(callback: (node: Node) => Node, memo: T): T;
        every(callback: (node: Node) => boolean): boolean;
        some(callback: (node: Node) => boolean): boolean;
        filter(callback: (node: Node) => boolean): Node[];
        sort(callback: (nodeA: Node, nodeB: Node) => number): Node[];
        toString(): string;
    }
    function isContainer(node: any): node is Root | Selector | Pseudo;

    interface NamespaceOptions extends NodeOptions {
        /** Namespace prefix including the | */
        ns?: string;
        /** Namespace prefix excluding the | */
        namespace?: string;
    }
    interface Namespace<Value extends string | undefined = string> extends Base<Value> {
        /** Namespace prefix including the | */
        readonly ns: string;
        /** Namespace prefix excluding the | */
        readonly namespace: string;
    }
    function isNamespace(node: any): node is ClassName | Attribute | Tag;

    interface Root extends Container<undefined> {
        type: "root";
    }
    function root(opts: ContainerOptions): Root;
    function isRoot(node: any): node is Root;

    interface Selector extends Container {
        type: "selector";
    }
    function selector(opts: ContainerOptions): Selector;
    function isSelector(node: any): node is Selector;

    interface Combinator extends Base {
        type: "combinator"
    }
    function combinator(opts: NodeOptions): Combinator;
    function isCombinator(node: any): node is Combinator;

    interface ClassName extends Namespace {
        type: "class";
    }
    function className(opts: NamespaceOptions): ClassName;
    function isClassName(node: any): node is ClassName;

    interface AttributeOptions extends NodeOptions {
        attribute: string;
        operator: string;
        insensitive?: boolean;
        ns?: string;
        raws?: {
          insensitive?: boolean;
        };
    }
    type AttributeOperator = "=" | "~=" | "|=" | "^=" | "$=" | "*=";
    interface Attribute extends Namespace<string | undefined> {
        type: "attribute";
        attribute: string;
        operator: AttributeOperator | undefined;
        insensitive?: boolean;
        raws: {
          insensitive?: boolean;
        };
        toString(): string;
    }
    function attribute(opts: AttributeOptions): Attribute;
    function isAttribute(node: any): node is Attribute;

    interface Pseudo extends Container {
        type: "pseudo";
    }
    function pseudo(opts: ContainerOptions): Pseudo;
    /**
     * Checks wether the node is the Psuedo subtype of node.
     */
    function isPseudo(node: any): node is Pseudo;

    /**
     * Checks wether the node is, specifically, a pseudo element instead of
     * pseudo class.
     */
    function isPseudoElement(node: any): node is Pseudo;

    /**
     * Checks wether the node is, specifically, a pseudo class instead of
     * pseudo element.
     */
    function isPseudoClass(node: any): node is Pseudo;


    interface Tag extends Namespace {
        type: "tag";
    }
    function tag(opts: NamespaceOptions): Tag;
    function isTag(node: any): node is Tag;

    interface Comment extends Base {
        type: "comment";
    }
    function comment(opts: NodeOptions): Comment;
    function isComment(node: any): node is Comment;

    interface Identifier extends Base {
        type: "id";
    }
    function id(opts: any): any;
    function isIdentifier(node: any): node is Identifier;

    interface Nesting extends Base {
        type: "nesting";
    }
    function nesting(opts: any): any;
    function isNesting(node: any): node is Nesting;

    interface String extends Base {
        type: "string";
    }
    function string(opts: NodeOptions): String;
    function isString(node: any): node is String;

    interface Universal extends Base {
        type: "universal";
    }
    function universal(opts?: NamespaceOptions): any;
    function isUniversal(node: any): node is Universal;
}
