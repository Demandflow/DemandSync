'use client';

import { useEditor, EditorContent, Editor, Range } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Type, Hash, CheckSquare, Quote, Code, Flag, Heading } from 'lucide-react';
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
}

interface CommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface CommandListProps {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
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
            }
        },
        [command, items]
    );

    useEffect(() => {
        const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
        const onKeyDown = (e: KeyboardEvent) => {
            if (!navigationKeys.includes(e.key)) {
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((selectedIndex + items.length - 1) % items.length);
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((selectedIndex + 1) % items.length);
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                selectItem(selectedIndex);
            }
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
                    props.command({ range });
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

export function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: {
                    HTMLAttributes: {
                        class: 'prose-code',
                    },
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'task-list',
                },
            }),
            TaskItem.configure({
                HTMLAttributes: {
                    class: 'task-item',
                },
                nested: true,
            }),
            Placeholder.configure({
                placeholder: 'Type / for commands...',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="w-full">
            <div className="ProseMirror">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
} 