import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
} from "react-router-dom";
import TabsPage from './components/TabsPage';
import DraggableTabs from './components/DraggableTabs';
import ModalTab from "./components/ModalTab";
import ModalArrow from "./components/ModalArrow";
import ConfirmationModal from "./components/ConfirmationModal";
import { v4 as uuidv4 } from 'uuid';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            arrows: [],
            tabPositions: [],
            modalTab: null,
            modalArrow: null,
            confirmationModal: null
        };
    }

    setTabs = (newValue) => {
        this.setState({ tabs: newValue });
    }

    setArrows = (newValue) => {
        this.setState({ arrows: newValue });
    }

    setTabPositions = (newValue) => {
        this.setState({ tabPositions: newValue });
    }

    addTab = () => {
        const newTab = { id: uuidv4(), name: `Вкладка ${this.state.tabs.length + 1}`, data: [], incomingData: [], selectedData: [] };
        const newPosition = { id: newTab.id, x: 100 + this.state.tabs.length * 50, y: 100 };
        this.setTabs([...this.state.tabs, newTab]);
        this.setTabPositions([...this.state.tabPositions, newPosition]);
    };

    renameTab = (id, newName) => {
        this.setTabs(this.state.tabs.map(tab => tab.id === id ? { ...tab, name: newName } : tab));
    };

    deleteTab = (id) => {
        this.setTabs(this.state.tabs.filter(tab => tab.id !== id));
        this.setTabPositions(this.state.tabPositions.filter(pos => pos.id !== id));
        this.setArrows(this.state.arrows.filter(arrow => arrow.from !== id && arrow.to !== id));
    };

    updateArrow = (arrowId, updatedArrow) => {
        this.setState({
            arrows: this.state.arrows.map(arrow =>
                arrow.id === arrowId ? updatedArrow : arrow
            ),
        }, () => {
            this.updateDependentData();
        });
    };
    updateArrowData = (arrowId, updatedArrow) => {
        this.setArrows(this.state.arrows.map(arrow => (arrow.id === arrowId ? updatedArrow : arrow)));
        this.updateBlockDataBasedOnArrows(updatedArrow);
    };
    updateTabPosition = (id, x, y) => {
        this.setTabPositions(this.state.tabPositions.map(pos => (pos.id === id ? { ...pos, x, y } : pos)));
    };

    updateArrowEnd = (arrowId, endX, endY) => {
        const arrowIndex = this.state.arrows.findIndex((arrow) => arrow.id === arrowId);
        if (arrowIndex !== -1) {
            const updatedArrow = {
                ...this.state.arrows[arrowIndex],
                endX,
                endY,
            };
            const updatedArrows = [...this.state.arrows];
            updatedArrows[arrowIndex] = updatedArrow;
            this.setState({ arrows: updatedArrows }, this.updateDependentData);
        }
    };

    openModalTab = (tab) => {
        this.setState({ modalTab: tab });
    };

    closeModalTab = () => {
        this.setState({ modalTab: null });
    };

    openModalArrow = (arrow) => {
        const fromTab = this.state.tabs.find(tab => tab.id === arrow.from);
        const incomingData = fromTab ? fromTab.incomingData : [];
        this.setState({ modalArrow: { ...arrow, incomingData } });
    };

    closeModalArrow = () => {
        this.setState({ modalArrow: null });
    };

    openConfirmationModal = (message, onConfirm) => {
        this.setState({ confirmationModal: { message, onConfirm } });
    };

    closeConfirmationModal = () => {
        this.setState({ confirmationModal: null });
    };

    updateDependentData = () => {
        const { arrows, tabs } = this.state;

        // Создаем копию tabs с обнуленными incomingData
        let updatedTabs = tabs.map(tab => ({
            ...tab,
            incomingData: [],
        }));

        // Функция для получения входящих данных для конкретного блока
        const getIncomingData = (tabId, traversedArrows = new Set()) => {
            let incomingData = [];
            arrows.forEach(arrow => {
                if (arrow.to === tabId && !traversedArrows.has(arrow.id)) {
                    traversedArrows.add(arrow.id); // Помечаем стрелку как обработанную
                    const fromTab = updatedTabs.find(tab => tab.id === arrow.from);
                    if (fromTab) {
                        const selectedData = arrow.selectedData || [];
                        incomingData.push(...selectedData);
                        const fromIncomingData = getIncomingData(fromTab.id, traversedArrows);
                        incomingData.push(...fromIncomingData.filter(item => !selectedData.includes(item)));
                    }
                }
            });
            return incomingData;
        };

        // Обновляем все блоки
        updatedTabs = updatedTabs.map(tab => ({
            ...tab,
            incomingData: getIncomingData(tab.id),
        }));

        this.setTabs(updatedTabs);
    };

    updateTabData = (tabId, newData) => {
        const updatedTabs = this.state.tabs.map(tab =>
            tab.id === tabId ? { ...tab, data: newData } : tab
        );
        this.setTabs(updatedTabs);
    };

    calculateTab = (tabId) => {
        const tab = this.state.tabs.find(tab => tab.id === tabId);

        if (tab) {
            const allData = [...tab.incomingData, ...tab.data];
            const total = allData.reduce((sum, row) => sum + parseFloat(row.col2 || 0), 0);
            const newData = tab.data.map(row => ({
                ...row,
                col3: (parseFloat(row.col2 || 0) / total * 100).toFixed(2)
            }));

            const updatedTabs = this.state.tabs.map(t =>
                t.id === tabId ? { ...t, data: newData } : t
            );

            this.setState({ tabs: updatedTabs }, () => {
                this.updateDependentData();
            });
        }
    };

    removeArrowData = (arrow) => {
        const { to, id } = arrow;
        this.setTabs(this.state.tabs.map(tab => {
            if (tab.id === to) {
                return {
                    ...tab,
                    incomingData: tab.incomingData.filter(data => data.arrowId !== id)
                };
            }
            return tab;
        }));
    };

    updateBlockDataBasedOnArrows = (arrow) => {
        const { to, selectedData } = arrow;
        this.setTabs(this.state.tabs.map(tab => {
            if (tab.id === to) {
                return {
                    ...tab,
                    incomingData: [
                        ...tab.incomingData.filter(data => data.arrowId !== arrow.id),
                        ...selectedData.map(data => ({ ...data, arrowId: arrow.id }))
                    ]
                };
            }
            return tab;
        }));
    };
    deleteArrow = (arrowId) => {
        const deletedArrow = this.state.arrows.find(arrow => arrow.id === arrowId);
        this.setArrows(this.state.arrows.filter(arrow => arrow.id !== arrowId));
        this.removeArrowData(deletedArrow);
        this.closeModalArrow();
    };
    render() {
        const { tabs, arrows, tabPositions, modalTab, modalArrow, confirmationModal } = this.state;

        return (
            <BrowserRouter>
                <div className="Nav">
                    <NavLink to="/">Страница с вкладками</NavLink>
                    <NavLink to="/list">Произвольное размещение</NavLink>
                </div>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <TabsPage
                                tabs={tabs}
                                updateTabs={this.setTabs}
                                addTab={this.addTab}
                                openModalTab={this.openModalTab}
                                updateTabData={this.updateTabData}
                                calculateTab={this.calculateTab}
                            />
                        }
                    />
                    <Route
                        path="/list"
                        element={
                            <DraggableTabs
                                tabs={tabs}
                                arrows={arrows}
                                tabPositions={tabPositions}
                                setTabs={this.setTabs}
                                setArrows={this.setArrows}
                                setTabPositions={this.setTabPositions}
                                updateTabPosition={this.updateTabPosition}
                                addTab={this.addTab}
                                updateArrowEnd={this.updateArrowEnd}
                                updateArrow={this.updateArrow}
                                openModalTab={this.openModalTab}
                                openModalArrow={this.openModalArrow}
                            />
                        }
                    />
                </Routes>
                {modalTab && (
                    <ModalTab
                        block={modalTab}
                        closeModal={this.closeModalTab}
                        renameBlock={this.renameTab}
                        deleteBlock={(id) => this.openConfirmationModal('Вы уверены, что хотите удалить этот блок?', () => this.deleteTab(id))}
                    />
                )}
                {modalArrow && (
                    <ModalArrow
                        arrow={modalArrow}
                        blockData={tabs.find(tab => tab.id === modalArrow.from)?.data || []}
                        incomingData={modalArrow.incomingData || []}
                        closeModal={this.closeModalArrow}
                        updateArrowData={this.updateArrowData}
                        deleteArrow={(id) => this.openConfirmationModal('Вы уверены, что хотите удалить эту стрелку?', () => this.deleteArrow(id))}
                    />
                )}
                {confirmationModal && (
                    <ConfirmationModal
                        message={confirmationModal.message}
                        onConfirm={() => { confirmationModal.onConfirm(); this.closeConfirmationModal(); }}
                        onCancel={this.closeConfirmationModal}
                    />
                )}
            </BrowserRouter>
        );
    }
}
