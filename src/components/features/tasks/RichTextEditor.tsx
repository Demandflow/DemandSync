'use client';

import { useEditor, EditorContent, Editor, Range, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Type, Hash, CheckSquare, Quote, Code, Flag, Heading1, Heading2, Underline as UnderlineIcon, Strikethrough } from 'lucide-react';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { useState, useCallback, useEffect, useRef } from 'react';
import 'highlight.js/styles/vs2015.css';

interface CommandItemProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

interface CommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface CommandListProps {
    items: CommandItemProps[];
    command: (props: any) => void;
    editor: Editor;
}

const CommandList = ({
    items,
    command,
    editor,
}: CommandListProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const commandListRef = useRef<HTMLDivElement>(null);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                command(item);
                editor.commands.focus();
            }
        },
        [command, items, editor]
    );

    useEffect(() => {
        const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
        const onKeyDown = (e: KeyboardEvent) => {
            if (!navigationKeys.includes(e.key)) {
                return false;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                return true;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((selectedIndex + 1) % items.length);
                return true;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                selectItem(selectedIndex);
                return true;
            }

            return false;
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [items, selectedIndex, selectItem]);

    return (
        <div
            ref={commandListRef}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-72"
        >
            <div className="p-2">
                <div className="text-sm text-gray-400 px-3 py-2">Basic blocks</div>
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => selectItem(index)}
                        className={`
                            w-full flex items-start gap-2 p-3 text-left rounded-md
                            ${selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'}
                        `}
                    >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200">
                            {item.icon}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface SuggestionProps {
    editor: Editor;
    range: Range;
    query: string;
    command: (props: { editor: Editor; range: Range; props: any }) => void;
}

interface CommandProps {
    editor: Editor;
    range: Range;
}

const getSuggestionItems = (editor: Editor) => [
    {
        title: 'Normal text',
        description: 'Just start writing with plain text.',
        icon: <Type className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
        },
    },
    {
        title: 'Heading 1',
        description: 'Large section heading.',
        icon: <Hash className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        },
    },
    {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: <Hash className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        },
    },
    {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: <Hash className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
        },
    },
    {
        title: 'Heading 4',
        description: 'Extra small section heading.',
        icon: <Hash className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 4 }).run();
        },
    },
    {
        title: 'Checklist',
        description: 'Track tasks with a checklist.',
        icon: <CheckSquare className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: 'Bulleted List',
        description: 'Create a simple bulleted list.',
        icon: <List className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: <ListOrdered className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: 'Code block',
        description: 'Display code with syntax highlighting.',
        icon: <Code className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setCodeBlock().run();
        },
    },
    {
        title: 'Quote',
        description: 'Add a quote or citation.',
        icon: <Quote className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus().deleteRange(range).setBlockquote().run();
        },
    },
    {
        title: 'Banner',
        description: 'Add a colored banner for important information.',
        icon: <Flag className="w-5 h-5 text-gray-600" />,
        command: ({ range }: { range: Range }) => {
            editor.chain().focus()
                .deleteRange(range)
                .setParagraph()
                .updateAttributes('paragraph', { class: 'banner' })
                .run();
        },
    },
];

const SlashCommands = Extension.create({
    name: 'slash-commands',
    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
                    if (props.command) {
                        props.command({ editor, range });
                    }
                },
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
}

interface FloatingToolbarProps {
    editor: Editor;
}

const FloatingToolbar = ({ editor }: FloatingToolbarProps) => {
    return (
        <BubbleMenu className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg shadow-md border border-gray-200" editor={editor}>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('strike') ? 'bg-gray-100' : ''}`}
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
            >
                <Code className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    const url = window.prompt('Enter the URL');
                    if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                    }
                }}
                className={`p-1.5 rounded hover:bg-gray-100 text-gray-600 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <button
                className="flex items-center gap-1 p-1.5 rounded hover:bg-gray-100 text-gray-600"
            >
                <span className="text-sm">A</span>
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <button
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </BubbleMenu>
    );
};

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-4',
                    },
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            Strike,
            Placeholder.configure({
                placeholder: "Write something or '/' for commands...",
            }),
            SlashCommands.configure({
                suggestion: {
                    items: ({ query }: { query: string }) => {
                        const allItems = getSuggestionItems(editor!);
                        if (!query) return allItems;

                        return allItems.filter(item =>
                            item.title.toLowerCase().includes(query.toLowerCase()) ||
                            item.description.toLowerCase().includes(query.toLowerCase())
                        );
                    },
                    render: () => {
                        let component: ReactRenderer | null = null;
                        let popup: any | null = null;

                        return {
                            onStart: (props: any) => {
                                component = new ReactRenderer(CommandList, {
                                    props,
                                    editor: props.editor,
                                });

                                popup = tippy('body', {
                                    getReferenceClientRect: props.clientRect,
                                    appendTo: () => document.body,
                                    content: component.element,
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: 'manual',
                                    placement: 'bottom-start',
                                });
                            },
                            onUpdate: (props: any) => {
                                component?.updateProps(props);

                                popup?.[0].setProps({
                                    getReferenceClientRect: props.clientRect,
                                });
                            },
                            onKeyDown: (props: { event: KeyboardEvent }) => {
                                if (props.event.key === 'Escape') {
                                    popup?.[0].hide();
                                    return true;
                                }

                                if (component?.ref && typeof component.ref.onKeyDown === 'function') {
                                    return component.ref.onKeyDown(props);
                                }

                                return false;
                            },
                            onExit: () => {
                                popup?.[0].destroy();
                                component?.destroy();
                            },
                        };
                    },
                },
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="ProseMirror prose prose-sm max-w-none">
            {editor && <FloatingToolbar editor={editor} />}
            <EditorContent editor={editor} className="min-h-[300px] focus:outline-none" />
        </div>
    );
} 