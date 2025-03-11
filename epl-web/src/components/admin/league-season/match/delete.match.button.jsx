// // epl-web/src/components/admin/league-season/match/delete.match.button.jsx
// import { Button, Popconfirm, message, notification } from "antd";
// import { DeleteOutlined } from '@ant-design/icons';
// import { deleteMatchAPI } from "../../../../services/api.service.js";
//
// const DeleteMatchButton = ({ match, onSuccess }) => {
//     const handleDelete = async () => {
//         try {
//             const res = await deleteMatchAPI(match.id);
//
//             if (res.status === 200 || res.data) {
//                 message.success("Match deleted successfully");
//                 onSuccess();
//             } else {
//                 notification.error({
//                     message: "Failed to delete match",
//                     description: res.message || "An unknown error occurred"
//                 });
//             }
//         } catch (error) {
//             notification.error({
//                 message: "Error",
//                 description: error.message || "Failed to delete match"
//             });
//         }
//     };
//
//     return (
//         <Popconfirm
//             title="Delete Match"
//             description={`Are you sure you want to delete this match: ${match.host?.name} vs ${match.away?.name}?`}// epl-web/src/components/admin/league-season/match/delete.match.button.jsx
//             import { Button, Popconfirm, message, notification } from "antd";
// import { DeleteOutlined } from '@ant-design/icons';
//     import { deleteMatchAPI } from "../../../../services/api.service.js";
//
//     const DeleteMatchButton = ({ match, onSuccess }) => {
//         const handleDelete = async () => {
//             try {
//                 const res = await deleteMatchAPI(match.id);
//
//                 if (res.status === 200 || res.data) {
//                     message.success("Match deleted successfully");
//                     onSuccess();
//                 } else {
//                     notification.error({
//                         message: "Failed to delete match",
//                         description: res.message || "An unknown error occurred"
//                     });
//                 }
//             } catch (error) {
//                 notification.error({
//                     message: "Error",
//                     description: error.message || "Failed to delete match"
//                 });
//             }
//         };
//
//         return (
//             <Popconfirm
//                 title="Delete Match"
//                 description={`Are you sure you want to delete this match: ${match.host?.name} vs ${match.away?.name}?`}