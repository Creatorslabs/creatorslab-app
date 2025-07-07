export interface Task {
  _id: string;
  creator: {
    username: string;
    image: string;
  };
  title: string;
  type: string[];
  platform: string;
  image: string;
  description: string;
  target: string;
  rewardPoints: number;
  maxParticipants: number;
  status: "active" | "completed" | "inactive";
  expiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITask {
  _id: string;
  creator: {
    username: string;
    image: string;
  };
  title: string;
  type: string[];
  platform: string;
  image: string;
  description: string;
  target: string;
  category: string;
  rewardPoints: number;
  maxParticipants: number;
  status: "active" | "completed" | "inactive";
  expiration?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  currentParticipants?: number;
}
