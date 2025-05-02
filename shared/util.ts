import { marshall } from "@aws-sdk/util-dynamodb";
import { MovieCrewRole } from "./types";
import { movieCrew } from '../seed/movies';

type Entity = MovieCrewRole; 

export const generateItem = (entity: Entity) => {
  return {
    PutRequest: {
      Item: marshall(entity),
    },
  };
};

export const generateBatch = (data: Entity[]) => {
  return data.map((e) => {
    return generateItem(e);
  });
};

export function findCrewByMovieAndRole(movieId: number, role: string): MovieCrewRole | undefined {
  return movieCrew.find(
    (entry) =>
      entry.movieId === movieId &&
      entry.role.toLowerCase() === role.toLowerCase()
  );
}
