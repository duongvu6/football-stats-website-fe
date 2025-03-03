// epl-web/src/components/shared/generic/generic.table.jsx
import { Table } from "antd";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const GenericTable = ({
                          fetchDataFunction,
                          baseColumns,
                          extraColumns = [],
                          urlPrefix = '',
                          tableTitle = 'Data Table',
                          idField = 'id',
                          renderActions = null,
                          showAddButton = false
                      }) => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Use refs to track state changes without triggering re-renders
    const fetchController = useRef({
        initialized: false,
        fetchInProgress: false,
        prevPage: 1,
        prevPageSize: 5
    });

    // Define loadData inside useEffect to avoid dependencies issues
    useEffect(() => {
        const loadData = async () => {
            // Don't fetch if we're already fetching or if pagination hasn't changed
            if (fetchController.current.fetchInProgress ||
                (fetchController.current.initialized &&
                    fetchController.current.prevPage === current &&
                    fetchController.current.prevPageSize === pageSize)) {
                return;
            }

            fetchController.current.fetchInProgress = true;
            fetchController.current.prevPage = current;
            fetchController.current.prevPageSize = pageSize;

            setLoading(true);

            try {
                const res = await fetchDataFunction(current, pageSize);
                if (res && res.data) {
                    setData(res.data.result || []);

                    // Only update pagination if this is the first load
                    if (!fetchController.current.initialized) {
                        // Use local variables to avoid extra renders
                        const serverPage = res.data.meta?.page || current;
                        const serverPageSize = res.data.meta?.pageSize || pageSize;

                        if (serverPage !== current) {
                            setCurrent(serverPage);
                        }
                        if (serverPageSize !== pageSize) {
                            setPageSize(serverPageSize);
                        }

                        fetchController.current.initialized = true;
                    }

                    setTotal(res.data.meta?.total || 0);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
                fetchController.current.fetchInProgress = false;
            }
        };

        // Execute loadData
        loadData();

        // We don't include any dependencies other than what's explicitly needed
        // This will prevent the excessive API calls
    }, [current, pageSize, fetchDataFunction]);

    const onChange = (pagination) => {
        const newCurrent = Number(pagination.current);
        const newPageSize = Number(pagination.pageSize);

        // Only update state if values actually changed
        if (newCurrent !== current) {
            setCurrent(newCurrent);
        }

        if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
            // Reset to first page when changing page size
            if (current !== 1) {
                setCurrent(1);
            }
        }
    };

    // Add the index column (row number) to the beginning
    const indexColumn = {
        title: "#",
        render: (_, record, index) => {
            const calculatedIndex = (Number(current) - 1) * Number(pageSize) + index + 1;
            return isNaN(calculatedIndex) ? index + 1 : calculatedIndex;
        }
    };

    // Process columns to add Link to name column if specified
    const processedColumns = baseColumns.map(column => {
        if (column.linkField) {
            return {
                ...column,
                render: (text, record) => (
                    <Link to={`${urlPrefix}${record[idField]}`}>{text}</Link>
                )
            };
        }
        return column;
    });

    // Combine all columns
    const allColumns = [indexColumn, ...processedColumns, ...extraColumns];

    // Create a loadData function for external use that respects our state tracking
    const publicLoadData = () => {
        // Reset the "initialized" state to force a fresh load
        fetchController.current.initialized = false;
        // Reset pagination to first page when manually reloading
        setCurrent(1);
    };

    return {
        data,
        loadData: publicLoadData,
        current,
        pageSize,
        total,
        loading,
        tableProps: {
            columns: allColumns,
            dataSource: data,
            rowKey: idField,
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
            loading: loading
        }
    };
};

export default GenericTable;