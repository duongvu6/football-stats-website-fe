import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { fetchAllPlayersAPI } from "../../../services/api.service.js";

const AdminPlayerTable = () => {
    const [playerData, setPlayerData] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);

    useEffect(() => {
        loadPlayers();
    }, [current, pageSize]);

    const loadPlayers = async () => {
        if (current && pageSize) {
            setLoadingTable(true);
            const res = await fetchAllPlayersAPI(current, pageSize);
            console.log(res);
            if (res.data) {
                setPlayerData(res.data.result);
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
            setLoadingTable(false);
        }

    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            if (Number(pagination.current) !== Number(current)) {
                setCurrent(Number(pagination.current));
            }
        }

        if (pagination && pagination.pageSize) {
            if (Number(pagination.pageSize) !== Number(pageSize)) {
                setPageSize(Number(pagination.pageSize));
            }
        }
    };

    const columns = [
        {
            title: "#",
            render: (_, record, index) => {
                const calculatedIndex = (Number(current) - 1) * Number(pageSize) + index + 1;
                return isNaN(calculatedIndex) ? index + 1 : calculatedIndex;
            }
        },
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
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
        }
    ]

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                marginBottom: "10px"
            }}>
                <h3>Player Table</h3>
            </div>
            <Table
                columns={columns}
                dataSource={playerData}
                rowKey={"id"}
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    total: total,
                    showTotal: (total, range) => {
                        return (<div>{range[0]}-{range[1]} of {total} rows</div>)
                    },
                    pageSizeOptions: ['5', '10', '20', '50', '100'] // Allow more than 20 elements per page
                }}
                onChange={onChange}
                loading={loadingTable}
            />
        </>
    )
}
export default AdminPlayerTable;