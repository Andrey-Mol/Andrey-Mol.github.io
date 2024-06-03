import React, { Component } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TabTable from './TabTable';

const ItemType = 'TAB';

const Tab = ({ tab, index, moveTab, setActiveTab, activeTab, openModalTab }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveTab(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            onClick={() => setActiveTab(tab.id)}
            className={`TabButton ${tab.id === activeTab && 'active'}`}
            onDoubleClick={() => openModalTab(tab.id)}
        >
            {tab.name}
        </div>
    );
};

export default class TabsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
        };
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.moveTab = this.moveTab.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this);
        this.calculateTab = this.calculateTab.bind(this);
        this.updateTabData = this.updateTabData.bind(this);
    }

    handleDoubleClick(id) {
        const tab = this.props.tabs.find((tab) => tab.id === id);
        this.props.openModalTab(tab);
    }

    moveTab(fromIndex, toIndex) {
        const tabs = [...this.props.tabs];
        const [movedTab] = tabs.splice(fromIndex, 1);
        tabs.splice(toIndex, 0, movedTab);
        this.props.updateTabs(tabs); // Ensure your parent component updates the tabs array accordingly
    }

    setActiveTab(id) {
        this.setState({ activeTab: id });
    }

    calculateTab = (tabId) => {
        this.props.calculateTab(tabId);
    }

    updateTabData(tabId, newData) {
        this.props.updateTabs(this.props.tabs.map(tab =>
            tab.id === tabId ? { ...tab, data: newData } : tab
        ));
    }

    render() {
        const { tabs } = this.props;
        const { activeTab } = this.state;

        const activeTabData = tabs.find(tab => tab.id === activeTab);

        return (
            <DndProvider backend={HTML5Backend}>
                <div className="TabBar">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab.id}
                            index={index}
                            tab={tab}
                            moveTab={this.moveTab}
                            setActiveTab={this.setActiveTab}
                            activeTab={activeTab}
                            openModalTab={this.handleDoubleClick}
                        />
                    ))}
                    <div className="AddTabButton" onClick={this.props.addTab}>
                        +
                    </div>
                </div>
                <button onClick={() => this.calculateTab(activeTab)}>Рассчитать вкладку</button>
                {activeTabData && (
                    <TabTable tab={activeTabData} updateTabData={this.updateTabData} />
                )}
            </DndProvider>
        );
    }
}