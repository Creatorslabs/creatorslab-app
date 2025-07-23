// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { IoMdArrowBack, IoMdArrowRoundBack } from "react-icons/io";
// import { MdCameraEnhance, MdVerified } from "react-icons/md";
// import { IoArrowForward } from "react-icons/io5";
// import { FaDiscord, FaSquareXTwitter } from "react-icons/fa6";
// import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
// import { usePrivy } from "@privy-io/react-auth";
// import Skeleton from "../../components/skeleton-loader";
// import { clipBeforeLastColon } from "@/actions/clip-privy-id";
// import { useEffect, useState } from "react";
// import { IUser } from "@/models/user";
// import { isVerified } from "@/actions/isUserVerified";
// import { useParams, useRouter } from "next/navigation";
// import { GoUnverified } from "react-icons/go";
// import TaskCard from "../../tasks/_comp/task-card";
// import { toast } from "react-toastify";
// import CustomModal from "../../components/Modals/custom-modal";

// function AllTask({ tasks }) {
//   return tasks.map((task, i) => <TaskCard task={task} key={i} />);
// }

// const Page = () => {
//   const { user, authenticated, ready } = usePrivy();
//   const [dbUser, setDbUser] = useState<IUser>();
//   const [mainUser, setMainUser] = useState<IUser>();
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { creatorId } = useParams();
//   const [unfollowModal, setUnfollowModal] = useState(false);
//   const [followModal, setFollowModal] = useState(false);

//   const follow = async () => {
//     if (!user || !creatorId) return;
//     setLoading(true);

//     try {
//       const res = await fetch("/api/user/follow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: clipBeforeLastColon(user.id),
//           creatorId,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to follow user");

//       setIsFollowing(true);
//       toast.success(`You just followed ${dbUser?.username}`);
//     } catch (error) {
//       console.error("Error following user:", error);
//       toast.error((error as Error).message);
//     } finally {
//       setLoading(false);
//       setFollowModal(false);
//     }
//   };

//   const unfollow = async () => {
//     if (!user || !creatorId || !mainUser) return;
//     setLoading(true);

//     if (mainUser?.balance < 5)
//       throw new Error("You dont have enough balance to unfollow!");

//     try {
//       const res = await fetch("/api/user/unfollow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: clipBeforeLastColon(user.id),
//           creatorId,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to unfollow user");

//       setIsFollowing(false);
//       toast.success(`You just unfollowed ${dbUser?.username}`);
//     } catch (error) {
//       console.error("Error unfollowing user:", error);
//       toast.error((error as Error).message);
//     } finally {
//       setLoading(false);
//       setUnfollowModal(false);
//     }
//   };

//   const fetchUser = async (userId) => {
//     try {
//       const response = await fetch(`/api/creator/get`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to fetch user: ${response.statusText}`);

//       const data = await response.json();
//       console.log("Fetched User:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       return null;
//     }
//   };

//   const fetchMainUser = async (userId) => {
//     try {
//       const response = await fetch(`/api/creator/get`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (!response.ok)
//         throw new Error(`Failed to fetch main user: ${response.statusText}`);

//       const data = await response.json();
//       console.log("Fetched Main User:", data);
//       return data;
//     } catch (error) {
//       console.error("Error fetching main user:", error);
//       return null;
//     }
//   };

//   const checkFollowingStatus = async (userId, creatorId, setIsFollowing) => {
//     try {
//       const response = await fetch("/api/user/isfollowing", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, creatorId }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setIsFollowing(data.isFollowing);
//       } else {
//         console.error("Error checking follow status:", data.error);
//       }
//     } catch (error) {
//       console.error("Request failed:", error);
//     }
//   };

//   useEffect(() => {
//     if (user && creatorId) {
//       checkFollowingStatus(
//         clipBeforeLastColon(user?.id),
//         creatorId,
//         setIsFollowing
//       );
//     }
//   }, [user, creatorId]);

//   useEffect(() => {
//     if (ready && authenticated) {
//       const userId = clipBeforeLastColon(user?.id);

//       fetchUser(creatorId).then(setDbUser);
//       fetchMainUser(userId).then(setMainUser);
//     }
//   }, [ready, authenticated, user, creatorId]);

//   if (!ready) {
//     return <Skeleton height="440px" />;
//   }

//   if (ready && !authenticated) {
//     router.push("/login");
//     return null;
//   }

//   if (ready && authenticated && dbUser) {
//     return (
//       <div className="w-full">
//         <div className="w-full py-4 min-h-screen">
//           {/* header navigation section */}
//           <div className="sm:flex justify-between items-center my-6 block">
//             <div className="p-3 rounded-lg bg-[#F7F8F9] dark:bg-[#242424] dark:text-white w-fit">
//               <Link href={"/"}>
//                 <IoMdArrowRoundBack />
//               </Link>
//             </div>
//             <div className="flex justify-between items-center flex-1 sm:ml-5 sm:text-xl font-medium mt-4 sm:mt-0">
//               <p>View Creator</p>
//               <button className="dark:border border-[#606060] rounded-lg p-2 sm:px-4 sm:py-2 bg-[#F7F8F9] dark:bg-[#242424] dark:text-white flex justify-center items-center gap-2 text-xs sm:text-base">
//                 <Image
//                   src="/images/coin.svg"
//                   alt="coin"
//                   width={30}
//                   height={30}
//                   className="w-[15px] sm:w-[30px] h-[15px] sm:h-[30px]"
//                 />
//                 Earn $CLS
//               </button>
//             </div>
//           </div>
//           {/* details section */}
//           <div>
//             <div className="relative py-4">
//               <Image
//                 src="/images/creator-bg.svg"
//                 alt="creator-bg"
//                 width={830}
//                 height={200}
//                 className="w-full h-[220px] object-cover rounded-2xl hidden sm:block"
//               />

//               <Image
//                 src="/images/profile-bkg.svg"
//                 alt="creator-bg"
//                 width={380}
//                 height={200}
//                 className="w-full h-[244px] object-cover rounded-2xl block sm:hidden"
//               />
//               <div className="bkg-creator-profile py-4">
//                 <div className="creator-profile-img" style={{ width: "100%" }}>
//                   <div className="relative">
//                     <Image
//                       src={"/images/dp.svg"}
//                       alt="profile"
//                       width={136}
//                       height={136}
//                       className="z-0 w-[70px] sm:w-[136px] h-[70px] sm:h-[136px] mx-auto sm:ml-0 rounded-full"
//                     />
//                     <div className="bg-white rounded-md p-1 w-fit sm:flex right-2 -mt-6 z-10 absolute hidden">
//                       <MdCameraEnhance color="#000" size={24} />
//                     </div>
//                   </div>
//                   <div className="flex items-center flex-col md:flex-row justify-between flex-1 flex-wrap gap-4">
//                     <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center sm:justify-start sm:items-start">
//                       <div className="flex xl:flex-col flex-row xl: gap-5">
//                         <p className="sm:text-xl my-0 text-white font-bold">
//                           {dbUser.username}
//                         </p>
//                         {isVerified(user!) ? (
//                           <p className="bg-[#F7F8F9] dark:bg-[#242424] dark:text-white w-fit h-fit py-1 px-3 rounded-lg flex gap-1 sm:gap-2 items-center justify-center">
//                             <MdVerified
//                               height={30}
//                               width={30}
//                               color="#1a56db"
//                             />
//                             <span className="text-xs sm:text-sm">Verified</span>
//                           </p>
//                         ) : (
//                           <p className="bg-[#F7F8F9] dark:bg-[#242424] dark:text-white w-fit h-fit py-1 px-3 rounded-lg flex gap-1 sm:gap-2 items-center justify-center">
//                             <GoUnverified
//                               height={30}
//                               width={30}
//                               color="#e02424"
//                             />
//                             <span className="text-xs sm:text-sm">
//                               Not verified
//                             </span>
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-white">
//                           {dbUser?.followers?.length ?? 0}{" "}
//                           {dbUser?.followers?.length === 1
//                             ? "follower"
//                             : "followers"}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="flex justify-between items-center border-[#606060] border rounded-lg p-2 gap-1 text-xs text-white">
//                           <FaSquareXTwitter size={20} />
//                           {user?.twitter
//                             ? user?.twitter?.username
//                             : "Not linked"}
//                         </div>
//                         <div className="flex justify-between items-center border-[#606060] border rounded-lg p-2 gap-1 text-xs text-white">
//                           <FaDiscord size={20} />
//                           {user?.discord
//                             ? user?.discord?.username
//                             : "Not linked"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-2 justify-center items-center">
//                       <button
//                         onClick={
//                           isFollowing
//                             ? () => setUnfollowModal(true)
//                             : () => setFollowModal(true)
//                         }
//                         disabled={loading}
//                         className="bg-white bg-opacity-20 w-fit h-fit p-2 sm:px-4 rounded-lg flex gap-2 items-center text-sm text-white"
//                       >
//                         <span>
//                           {" "}
//                           {loading
//                             ? "Processing..."
//                             : isFollowing
//                             ? "Unfollow"
//                             : "Follow"}
//                         </span>
//                       </button>
//                       <button className="bg-white bg-opacity-20 w-fit h-fit p-2 sm:px-4 rounded-lg flex gap-2 items-center text-sm text-white">
//                         <HiOutlineQuestionMarkCircle size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center justify-between pb-6 mt-8">
//               <p className="flex-1">All taks</p>
//               <div className="flex flex-row gap-2 items-center">
//                 <Link href="#" className="text-gray-500 text-sm underline">
//                   {`Show all (${dbUser.createdTasks.length})`}
//                 </Link>
//                 <div className="rounded-full bg-gray-700 text-gray-400 w-6 h-6 flex justify-center items-center">
//                   <IoMdArrowBack />
//                 </div>
//                 <div className="rounded-full bg-gray-700 text-gray-400 w-6 h-6 flex justify-center items-center">
//                   <IoArrowForward />
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <AllTask tasks={dbUser.createdTasks} />
//             </div>
//           </div>
//         </div>

//         <CustomModal isOpen={followModal} onClose={() => setFollowModal(false)}>
//           <div className="flex flex-col gap-3 justify-center items-center dark:text-white">
//             <p className="font-bold">Follow Creator</p>
//             <div className="border border-red-500 text-white bg-red-800/40 dark:bg-red-800/20 p-4 rounded-md text-center max-w-md mx-auto">
//               <p className="text-red-400 font-semibold">Please Note</p>
//               <p className="mt-1 text-sm">
//                 If you follow a creator, you will earn{" "}
//                 <span className="text-green-400">0.40$CLS</span>. But if you
//                 decide to unfollow this creator, you will be charged
//                 <span className="text-red-500"> 5$CLS</span>.
//               </p>
//             </div>
//             <button
//               onClick={follow}
//               className="w-full bg-gradient-to-b from-[#5D3FD1] to-[#03ABFF] p-2 rounded-md text-white"
//             >
//               Follow
//             </button>
//             <button
//               onClick={() => setFollowModal(false)}
//               className="w-full bg-transparent p-2 rounded-md"
//             >
//               Cancel
//             </button>
//           </div>
//         </CustomModal>

//         <CustomModal
//           isOpen={unfollowModal}
//           onClose={() => setUnfollowModal(false)}
//         >
//           <div className="flex flex-col gap-3 justify-center items-center dark:text-white">
//             <p className="font-bold">Unfollow Creator</p>
//             <div className="border border-red-500 text-white bg-red-800/40 dark:bg-red-800/20 p-4 rounded-md text-center max-w-md mx-auto">
//               <p className="text-red-400 font-semibold">Please Note</p>
//               <p className="mt-1 text-sm">
//                 If you decide to{" "}
//                 <span className="text-red-500 font-bold">unfollow</span> this
//                 creator, you will be charged{" "}
//                 <span className="text-red-500 font-bold">5$CLS</span>.
//               </p>
//             </div>
//             <button
//               onClick={unfollow}
//               className="w-full bg-gradient-to-b from-[#F44336] to-[#F44336] p-2 rounded-md text-white"
//             >
//               Unfollow
//             </button>
//             <button
//               onClick={() => setUnfollowModal(false)}
//               className="w-full bg-transparent p-2 rounded-md"
//             >
//               Cancel
//             </button>
//           </div>
//         </CustomModal>
//       </div>
//     );
//   }

//   return <Skeleton height="440px" />;
// };

// export default Page;
