import React, { useState, useRef } from 'react';
import { FaTrash, FaPen, FaEllipsisV, FaCheck, FaEdit, FaUserSecret } from 'react-icons/fa';
import { Button } from './ui/button'; // Import the Button component
import useChatStore, { Conversation } from '../hooks/useChatStore';

const Conversations: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown menu
  const conversations = useChatStore((state) => state.conversations);
  const setCurrentConversation = useChatStore((state) => state.setCurrentConversation);
  const addConversation = useChatStore((state) => state.addConversation);
  const setCurrentConversationId = useChatStore((state) => state.setCurrentConversationId);
  const [newConversationName, setNewConversationName] = useState('');  

  const handleCreatePrivateConversation = () => {
    const newConversation: Conversation = {
      id: `private-${Date.now()}`, // A unique ID prefixed with 'private-'
      name: 'Private Conversation',
      messages: [],
    };

    setSelectedConversation(newConversation);
    setCurrentConversation(newConversation.messages);
    setCurrentConversationId(newConversation.id);
  };

  const handleCreateConversation = () => {
    const preString = 'Untitled';
    const existingUntitledNumbers = conversations
      .filter((conversation) => conversation.name.startsWith(preString))
      .map((conversation) => {
        const number = parseInt(conversation.name.replace(preString+' ', ''), 10);
        return isNaN(number) ? 0 : number;
      });
  
    const highestUntitledNumber = Math.max(...existingUntitledNumbers);
  
    const newConversationNumber = existingUntitledNumbers.length === 0 ? 1 : highestUntitledNumber + 1;
  
    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: `${preString} ${newConversationNumber}`,
      messages: [],
    };
  
    addConversation(newConversation);
    setSelectedConversation(newConversation);
    setCurrentConversation(newConversation.messages);
    setCurrentConversationId(newConversation.id);
  };
  

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentConversation(conversation.messages);
    setCurrentConversationId(conversation.id);
  };

  const handleEditName = (conversationId: string) => {
    const currentConversation = conversations.find(conversation => conversation.id === conversationId);
    if (currentConversation) {
      setNewConversationName(currentConversation.name); // Set the current name in the input field
    }
    setEditingConversationId(conversationId);
  };
  
  const handleSaveName = (conversationId: string, newName: string) => {
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === conversationId) {
        return { ...conversation, name: newName.trim() || conversation.name };
      }
      return conversation;
    });
  
    useChatStore.getState().setConversations(updatedConversations);
    setEditingConversationId(null);
    useChatStore.getState().saveConversationsToIndexedDB(updatedConversations); // Ensure this is called to update IndexedDB
  };
  
  const handleDeleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conversation => conversation.id !== conversationId);
    useChatStore.getState().setConversations(updatedConversations);
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
    useChatStore.getState().saveConversationsToIndexedDB(updatedConversations); // Update IndexedDB
  };  

  return (
    <div className="">
      <Button onClick={handleCreatePrivateConversation} variant="outline" className="items-center justify-start text-xs text-left flex items-left mr-auto px-4 py-2 rounded shadow mb-2 w-full">
          <FaUserSecret className="mr-2" /> New Private Chat
      </Button>
      <Button onClick={handleCreateConversation} variant="outline" className="items-center justify-start text-xs text-left flex items-left mr-auto px-4 py-2 rounded shadow mb-4 w-full">
          <FaEdit className="mr-2" /> New Stored Chat
      </Button>
      <h2 className="text-base bold font-medium">Conversations</h2>
      <ul className="divide-y divide-gray-200">
        {conversations.map((conversation, index) => (
          <li key={`conversation-${index}`} className="py-2 flex justify-between items-center">
            <div className="flex-grow">
              {editingConversationId === conversation.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newConversationName}
                    onChange={(e) => setNewConversationName(e.target.value)}
                    placeholder="New conversation name"
                    className="border rounded pl-2 py-1 mr-2 text-xs w-full"
                  />
                  <FaCheck className="text-green-500 cursor-pointer" onClick={() => handleSaveName(conversation.id, newConversationName)} />
                </div>
              ) : (
                <span
                  onClick={() => handleSelectConversation(conversation)}
                  className={`cursor-pointer text-xs ${selectedConversation === conversation ? 'font-medium text-blue-500' : 'text-gray-700'}`}
                >
                  {conversation.name}
                </span>
              )}
            </div>
            {editingConversationId !== conversation.id ? (
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowActionsDropdown(conversation.id === showActionsDropdown ? null : conversation.id)}
                >
                  <FaEllipsisV className="h-5 w-5 transform rotate-90" />
                </button>
                {showActionsDropdown === conversation.id && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
                    <div className="py-1">
                      <button
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          handleEditName(conversation.id);
                          setShowActionsDropdown(null);
                        }}
                      >
                        <FaPen className="mr-2 inline-block" />
                        Edit Name
                      </button>
                      <button
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          handleDeleteConversation(conversation.id);
                          setShowActionsDropdown(null);
                        }}
                      >
                        <FaTrash className="mr-2 inline-block" />
                        Delete Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;
