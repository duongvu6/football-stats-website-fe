import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service";

const BaseClubTable = ({ renderActions, urlPrefix = '', extraColumns = [], showAddButton = false }) => {
    const [clubData, setClubData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    // Load data only on initial render and when pagination changes
    useEffect(() => {
        loadClubs();
    }, [current, pageSize]);
    const loadClubs = useCallback(async () => {
        if (loadingTable) {
            return;
        }
        setLoadingTable(true);
        try {
            const res = await fetchAllClubsWithPaginationAPI(current, pageSize);
            if (res && res.data) {
                setClubData(res.data.result || []);
                // Don't update state values that would trigger another fetch
                if (!isInitialized) {
                    setCurrent(res.data.meta.page || current);
                    setPageSize(res.data.meta.pageSize || pageSize);
                    setIsInitialized(true);
                }
                setTotal(res.data.meta.total || 0);
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
            notification.error({
                message: error.message,
                description: error.description
            })
        } finally {
            setLoadingTable(false);
        }
    }, [current, pageSize, loadingTable, isInitialized])
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
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "Stadium name",
            dataIndex: "stadiumName",
        },
        ...extraColumns
    ];
    return {
        clubData,
        loadClubs,
        current,
        pageSize,
        total,
        loadingTable,
        tableProps: {
            columns: baseColumns,
            dataSource: clubData,
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
}
export default BaseClubTable;