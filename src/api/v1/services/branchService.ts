import { Branch } from "../models/branchModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { RepositoryError, ServiceError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

const COLLECTION: string = "branches";

/**
 * @description Get all branches set the function async temporarily.
 * @returns a Promise that resolves to an array of `Branch` objects.
 */
export const getAllBranches = async (): Promise<Branch[]> => {
  try {
    // filter the employees using the query parameter
    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocuments(COLLECTION);
    const branches: Branch[] = snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as Branch;
    });

    return branches;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to get documents in ${COLLECTION}, ${getErrorMessage(error)}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description get an branch by id.
 * @param {string} id - The ID of the branch.
 * @returns {Promise<Branch>}
 * @throws {Error} If the branch with the given ID is not found.
 */
export const getBranchById = async (id: string): Promise<Branch> => {
  try {
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, id);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      return { id: snapshot.id, ...data } as Branch;
    } else {
      throw new Error(`Id: ${id} couldnot be found`);
    }
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to get document by id in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description create an branch.
 * @param {{name: string;  address: string; phone: string;  }}
 * branch - the branch data
 * @returns {Promise<Branch>} A promise that resolves to the created branch
 */
export const createBranch = async (branch: {
  name: string;
  address: string;
  phone: string;
}): Promise<Branch> => {
  try {
    const id: string = await firestoreRepository.createDocument(
      COLLECTION,
      branch
    );
    return { id, ...branch } as Branch;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to create document in ${COLLECTION} with data: ${branch}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Update an existing branch.
 * @param {string} targetId - The ID of the branch to update.
 * @param {Partial<Branch>}
 * branch - the branch data
 * @returns {Promise<Branch>}
 * @throws {Error} If the branch with the given ID is not found.
 */
export const updateBranch = async (
  targetId: string,
  branch: Partial<Branch>
): Promise<Branch> => {
  try {
    await firestoreRepository.updateDocument(COLLECTION, targetId, branch);
    return { id: targetId, ...branch } as Branch;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to update document with id: ${targetId} in ${COLLECTION} with data: ${branch}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Delete an branch.
 * @param {string} id - The ID of the branch to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the branch with the given ID is not found.
 */
export const deleteBranch = async (id: string): Promise<void> => {
  try {
    await firestoreRepository.deleteDocument(COLLECTION, id);
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to delete document with id: ${id} in ${COLLECTION}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};
