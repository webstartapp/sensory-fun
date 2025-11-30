'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { EditorState, ContentState, convertToRaw, convertFromRaw, RichUtils, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { Editor } from 'draft-js';
import './RichTextEditor.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    className?: string;
    id?: string;
    minHeight?: string;
}

const RichTextEditor = ({
    value,
    onChange,
    label,
    error,
    placeholder = '',
    className = '',
    id,
    minHeight = '200px',
}: RichTextEditorProps) => {
    const [mounted, setMounted] = useState(false);
    const editorRef = useRef<Editor>(null);

    // Create editor state from value prop using useMemo to avoid unnecessary recreations
    const initialEditorState = useMemo(() => {
        if (value) {
            try {
                // Convert markdown to Draft.js format
                const rawData = markdownToDraft(value);
                
                if (rawData && (rawData.blocks?.length > 0 || rawData.contentBlocks?.length > 0)) {
                    // Use convertFromRaw to properly create ContentState from raw data
                    const rawContentState = {
                        blocks: rawData.blocks || rawData.contentBlocks || [],
                        entityMap: rawData.entityMap || {}
                    };
                    
                    const contentState = convertFromRaw(rawContentState);
                    return EditorState.createWithContent(contentState);
                }
                
                // If no valid blocks, fall back to plain text
                const contentState = ContentState.createFromText(value);
                return EditorState.createWithContent(contentState);
            } catch (e) {
                // If conversion fails, create editor with plain text
                const contentState = ContentState.createFromText(value);
                return EditorState.createWithContent(contentState);
            }
        }
        return EditorState.createEmpty();
    }, [value]);

    const [editorState, setEditorState] = useState<EditorState>(initialEditorState);

    // Update editor state when the computed initial state changes
    useEffect(() => {
        setEditorState(initialEditorState);
    }, [initialEditorState]);

    // Handle mounting state without effects
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
        const rawContent = convertToRaw(state.getCurrentContent());
        const markdown = draftToMarkdown(rawContent);
        onChange(markdown);
    };

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            handleEditorChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
        if (e.keyCode === 9) { // TAB
            const newEditorState = RichUtils.onTab(
                e as any,
                editorState,
                4, // maxDepth
            );
            if (newEditorState !== editorState) {
                handleEditorChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e as any);
    };

    const toggleBlockType = (blockType: string) => {
        handleEditorChange(
            RichUtils.toggleBlockType(editorState, blockType)
        );
    };

    const toggleInlineStyle = (inlineStyle: string) => {
        handleEditorChange(
            RichUtils.toggleInlineStyle(editorState, inlineStyle)
        );
    };

    const focusEditor = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    return (
        <div className={className}>
            {label && (
                <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-200"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <div
                className={`draft-editor-wrapper rounded-md border overflow-hidden bg-white dark:bg-zinc-900 ${error ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                    }`}
            >
                {/* Simple Toolbar */}
                <div className="border-b border-gray-200 dark:border-zinc-700 p-2 flex gap-1 flex-wrap">
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleInlineStyle('BOLD')}
                        style={{
                            backgroundColor: editorState.getCurrentInlineStyle().has('BOLD') ? '#e5e7eb' : 'transparent'
                        }}
                    >
                        B
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleInlineStyle('ITALIC')}
                        style={{
                            backgroundColor: editorState.getCurrentInlineStyle().has('ITALIC') ? '#e5e7eb' : 'transparent'
                        }}
                    >
                        I
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleBlockType('header-one')}
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleBlockType('header-two')}
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleBlockType('unordered-list-item')}
                    >
                        UL
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-zinc-800 dark:border-zinc-600"
                        onClick={() => toggleBlockType('ordered-list-item')}
                    >
                        OL
                    </button>
                </div>
                
                {mounted ? (
                    <div 
                        className="draft-editor-content p-4 cursor-text"
                        style={{ minHeight }}
                        onClick={focusEditor}
                    >
                        <Editor
                            ref={editorRef}
                            editorState={editorState}
                            onChange={handleEditorChange}
                            handleKeyCommand={handleKeyCommand}
                            keyBindingFn={mapKeyToEditorCommand}
                            placeholder={placeholder}
                            customStyleMap={{
                                'BOLD': { fontWeight: 'bold' },
                                'ITALIC': { fontStyle: 'italic' },
                                'UNDERLINE': { textDecoration: 'underline' },
                                'STRIKETHROUGH': { textDecoration: 'line-through' },
                            }}
                            blockStyleFn={(block) => {
                                const type = block.getType();
                                switch (type) {
                                    case 'header-one':
                                        return 'editor-header-one';
                                    case 'header-two':
                                        return 'editor-header-two';
                                    case 'header-three':
                                        return 'editor-header-three';
                                    case 'unordered-list-item':
                                        return 'editor-unordered-list';
                                    case 'ordered-list-item':
                                        return 'editor-ordered-list';
                                    default:
                                        return 'editor-paragraph';
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-center text-gray-400"
                        style={{ minHeight }}
                    >
                        Loading editor...
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default RichTextEditor;
