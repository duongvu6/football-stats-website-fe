// epl-web/src/components/shared/player/base.player.table.jsx
import { Table } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {fetchAllPlayersAPI} from "../../../services/api.service.js";

const PlayerBaseTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    const [playerData, setPlayerData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Use useCallback to memoize the loadPlayers function
    const loadPlayers = useCallback(async () => {
        if (loadingTable) return; // Prevent concurrent requests

        setLoadingTable(true);
        try {
            const res = await fetchAllPlayersAPI(current, pageSize);
            if (res && res.data) {
                setPlayerData(res.data.result || []);
                // Don't update state values that would trigger another fetch
                if (!isInitialized) {
                    setCurrent(res.data.page || current);
                    setPageSize(res.data.pageSize || pageSize);
                    setIsInitialized(true);
                }
                setTotal(res.data.total || 0);
            }
        } catch (error) {
            console.error("Error loading players:", error);
        } finally {
            setLoadingTable(false);
        }
    }, [current, pageSize, loadingTable, isInitialized]);

    // Load data only on initial render and when pagination changes
    useEffect(() => {
        loadPlayers();
    }, [current, pageSize]);

    const onChange = (pagination) => {
        if (pagination && pagination.current) {
            if (Number(pagination.current) !== Number(current)) {
                setCurrent(Number(pagination.current));
            }
        }

        if (pagination && pagination.pageSize) {
            if (Number(pagination.pageSize) !== Number(pageSize)) {
                setPageSize(Number(pagination.pageSize));
                setCurrent(1); // Reset to first page when changing page size
            }
        }
    };

    const baseColumns = [
        {
            title: "#",
            render: (_, record, index) => {
                const calculatedIndex = (Number(current) - 1) * Number(pageSize) + index + 1;
                return isNaN(calculatedIndex) ? index + 1 : calculatedIndex;
            }
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => (
                // Fix URL path construction by ensuring proper formatting
                <Link to={`${urlPrefix}${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Shirt Number",
            dataIndex: "shirtNumber",
        },
        {
            title: "Citizenship",
            dataIndex: "citizenships",
            render: (citizenships) => {
                return Array.isArray(citizenships) ? citizenships.join(', ') : citizenships;
            }
        },
        {
            title: "Position",
            dataIndex: "positions",
            render: (positions) => {
                return Array.isArray(positions) ? positions.join(', ') : positions;
            }
        },
        {
            title: "Current Club",
            render: (_, record) => {
                return record.transferHistories && record.transferHistories[0] ?
                    record.transferHistories[0].club : "No information"
            }
        },
        {
            title: "Market Value(millions Euro)",
            dataIndex: "marketValue",
        },
        ...extraColumns
    ];

    return {
        playerData,
        loadPlayers,
        current,
        pageSize,
        total,
        loadingTable,
        tableProps: {
            columns: baseColumns,
            dataSource: playerData,
            rowKey: "id",
            pagination: {
                current: current,
                pageSize: pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                total: total,
                showTotal: (total, range) => {
                    return (<div>{range[0]}-{range[1]} of {total} rows</div>)
                },
                pageSizeOptions: ['5', '10', '20', '50', '100']
            },
            onChange: onChange,
            loading: loadingTable
        }
    };
};

export default PlayerBaseTable;