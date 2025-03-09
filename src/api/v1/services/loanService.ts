import { Loan } from "../models/loanModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { RepositoryError, ServiceError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

const COLLECTION: string = "loans";

/**
 * @description Get all loans that qualified with the optional parameters in  query， set the function async temporarily.
 * @returns a Promise that resolves to an array of `Loan` objects.
 */
export const getAllLoans = async (): Promise<Loan[]> => {
  try {
    // filter the loans using the query parameter

    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocuments(COLLECTION);
    return snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as Loan;
    });
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
 * @description get an loan by id.
 * @param {string} id - The ID of the loan.
 * @returns {Promise<Loan|null>}
 * @throws {Error} If the loan with the given ID is not found.
 */
export const getLoanById = async (id: string): Promise<Loan> => {
  try {
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, id);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      return { id: snapshot.id, ...data } as Loan;
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
 * @description create an Loan.
 * @param {Partial<Loan>}
 * loan - the Loan data
 * @returns {Promise<Loan>} A promise that resolves to the created Loan
 */
export const createLoan = async (loan: Partial<Loan>): Promise<Loan> => {
  try {
    // protect status field
    const newLoan: Partial<Loan> = { ...loan };
    delete newLoan.status;
    delete newLoan.requestDate;
    // set default value for new loan request date
    newLoan.requestDate = new Date();
    newLoan.status = "Request";

    const id: string = await firestoreRepository.createDocument(
      COLLECTION,
      newLoan
    );
    return { id, ...newLoan } as Loan;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to create document in ${COLLECTION} with data: ${loan}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Update an existing loan.
 * @param {string} targetId - The ID of the loan to update.
 * @param {Partial<Loan>}
 * Loan - the Loan data
 * @returns {Promise<Loan>}
 * @throws {Error} If the Loan with the given ID is not found.
 */
export const updateLoan = async (
  targetId: string,
  loan: Partial<Loan>
): Promise<Loan> => {
  try {
    await firestoreRepository.updateDocument(COLLECTION, targetId, loan);
    return { id: targetId, ...loan } as Loan;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to update document with id: ${targetId} in ${COLLECTION} with data: ${loan}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};
