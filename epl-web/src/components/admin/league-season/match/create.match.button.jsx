// // epl-web/src/components/admin/league-season/match/create.match.button.jsx
// import { Button } from "antd";
// import { PlusOutlined } from '@ant-design/icons';
// import { useState } from "react";
// import CreateMatchModal from "./create.match.modal.jsx";
//
// const CreateMatchButton = ({ leagueSeason, onSuccess }) => {
//     const [isOpen, setIsOpen] = useState(false);
//
//     const onOpen = () => {
//         setIsOpen(true);
//     };
//
//     return (
//         <>
//             <Button
//                 type="primary"
//                 icon={<PlusOutlined />}
//                 onClick={onOpen}
//             >
//                 Add Match
//             </Button>
//             <CreateMatchModal
//                 isOpen={isOpen}
//                 setIsOpen={setIsOpen}
//                 leagueSeason={leagueSeason}
//                 onSuccess={onSuccess}
//             />
//         </>
//     );
// };
//
// export default CreateMatchButton;