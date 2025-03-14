// epl-web/src/components/shared/generic/generic.table.jsx
import { Table, Button, Space } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const GenericTable = ({
                          fetchDataFunction,
                          baseColumns,
                          extraColumns = [],
                          urlPrefix = '',
                          tableTitle = '',
                          idField = 'id',
                          renderActions = null,
                          showAddButton = false,
                          onAddClick = null,
                          addButtonText = 'Add New'
                      }) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const res = await fetchDataFunction(params);

            // Handle both paginated and non-paginated responses
            if (res.data && res.data.result) {
                // Paginated response
                const { meta, result } = res.data;
                setData(result);
                setPagination({
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total
                });
            } else if (Array.isArray(res.data)) {
                // Non-paginated array response
                setData(res.data);
                setPagination({
                    ...pagination,
                    total: res.data.length
                });
            } else {
                console.error("Unexpected API response format:", res.data);
                setData([]);
                setPagination({
                    ...pagination,
                    total: 0
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({
            page: pagination.current,
            size: pagination.pageSize,
            sort: sortField ? `${sortField},${sortOrder === 'ascend' ? 'asc' : 'desc'}` : undefined
        });
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        setSortField(sorter.field);
        setSortOrder(sorter.order);
        setPagination(newPagination);

        // Fetch data with new parameters
        fetchData({
            page: newPagination.current,
            size: newPagination.pageSize,
            sort: sorter.field && sorter.order
                ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}`
                : undefined,
            // Add filter parameters if available
            ...Object.entries(filters).reduce((acc, [key, value]) => {
                if (value && value.length > 0) {
                    acc[key] = value.join(',');
                }
                return acc;
            }, {})
        });
    };

    // Process columns to add links and actions
    const processColumns = (columns) => {
        if (!columns || !Array.isArray(columns)) {
            return [];
        }

        return columns.map(column => {
            const processed = { ...column };

            // Apply default filtered values if provided
            if (column.defaultFilteredValue) {
                processed.filteredValue = column.defaultFilteredValue;
            }

            // Add link support for linkField columns
            if (column.linkField && urlPrefix) {
                processed.render = (text, record) => (
                    <Link to={`${urlPrefix}${record[idField]}`}>
                        {text}
                    </Link>
                );
            }

            return processed;
        });
    };

    // Process base columns
    const processedBaseColumns = processColumns(baseColumns);

    // Process extra columns
    const formattedExtraColumns = extraColumns.map(column => {
        if (column.defaultFilteredValue) {
            return {
                ...column,
                filteredValue: column.defaultFilteredValue
            };
        }
        return column;
    });

    // Add actions column if renderActions is provided
    if (renderActions) {
        formattedExtraColumns.push({
            title: 'Actions',
            key: 'action',
            render: (_, record) => renderActions(record)
        });
    }

    // Combine table props
    const tableProps = {
        dataSource: data,
        columns: [...processedBaseColumns, ...formattedExtraColumns],
        pagination: pagination,
        loading: loading,
        onChange: handleTableChange,
        rowKey: idField,
        tableTitle: tableTitle,
        addButton: showAddButton ? (
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddClick}
            >
                {addButtonText}
            </Button>
        ) : null
    };

    return { tableProps };
};

export default GenericTable;