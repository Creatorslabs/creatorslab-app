"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  taskId: string;
}

interface Participant {
  id: string;
  status: string;
  joinedAt: string;
  user: {
    username: string;
    image?: string;
  };
}

const LIMIT = 10;

export default function TaskParticipantsTab({ taskId }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/tasks/${taskId}/participants?page=${currentPage}`
        );
        const data = await res.json();

        setParticipants(data.participants || []);
        setCurrentParticipants(data.currentParticipants || 0);
        setMaxParticipants(data.maxParticipants || 0);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [taskId, currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center py-4">
        <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-white">Participants</h3>
        <p className="text-gray-400">
          {currentParticipants || 0} / {maxParticipants}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : participants.length > 0 ? (
              participants.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell>{(currentPage - 1) * LIMIT + i + 1}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={p.user.image || "/default-avatar.png"}
                        alt={p.user.username}
                      />
                      <AvatarFallback>
                        {p.user.username?.slice(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white">
                      {p.user.username || "Unnamed"}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {new Date(p.joinedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  No participants yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end pt-4">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </motion.div>
  );
}
