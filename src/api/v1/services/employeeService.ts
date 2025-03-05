import { Employee } from "../models/employeeModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { RepositoryError, ServiceError } from "../errors/errors";
import { getErrorCode, getErrorMessage } from "../utils/errorUtils";

const COLLECTION: string = "employees";

/**
 * @description Get all employees that qualified with the optional parameters in  query， set the function async temporarily.
 * @returns a Promise that resolves to an array of `Employee` objects.
 */
export const getAllEmployees = async (
  department: string | undefined,
  branchId: string | undefined
): Promise<Employee[]> => {
  try {
    // filter the employees using the query parameter

    const snapshot: FirebaseFirestore.QuerySnapshot =
      await firestoreRepository.getDocuments(COLLECTION);
    let resultEmployees: Employee[] = snapshot.docs.map((doc) => {
      const data: FirebaseFirestore.DocumentData = doc.data();
      return { id: doc.id, ...data } as Employee;
    });

    if (department) {
      resultEmployees = resultEmployees.filter(
        (employee) => employee.department === department
      );
    }
    if (branchId) {
      resultEmployees = resultEmployees.filter(
        (employee) => employee.branchId === branchId
      );
    }
    return resultEmployees;
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
 * @description get an employee by id.
 * @param {string} id - The ID of the employee.
 * @returns {Promise<Employee|null>}
 * @throws {Error} If the employee with the given ID is not found.
 */
export const getEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const snapshot: FirebaseFirestore.DocumentSnapshot | null =
      await firestoreRepository.getDocumentById(COLLECTION, id);
    if (snapshot && snapshot.exists) {
      const data: FirebaseFirestore.DocumentData = snapshot.data() || {};
      return { id: snapshot.id, ...data } as Employee;
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
 * @description create an employee.
 * @param {{name: string;  position: string;  department: string;  email: string;  phone: string;  branchId: number;}}
 * employee - the employee data
 * @returns {Promise<Employee>} A promise that resolves to the created employee
 */
export const createEmployee = async (employee: {
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  branchId: string;
}): Promise<Employee> => {
  try {
    const id: string = await firestoreRepository.createDocument(
      COLLECTION,
      employee
    );
    return { id, ...employee } as Employee;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to create document in ${COLLECTION} with data: ${employee}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Update an existing employee.
 * @param {string} targetId - The ID of the employee to update.
 * @param {Partial<Employee>}
 * employee - the employee data
 * @returns {Promise<Employee>}
 * @throws {Error} If the employee with the given ID is not found.
 */
export const updateEmployee = async (
  targetId: string,
  employee: Partial<Employee>
): Promise<Employee> => {
  try {
    await firestoreRepository.updateDocument(COLLECTION, targetId, employee);
    return { id: targetId, ...employee } as Employee;
  } catch (error: unknown) {
    if (error instanceof RepositoryError) {
      throw error;
    } else {
      throw new ServiceError(
        `Failed to update document with id: ${targetId} in ${COLLECTION} with data: ${employee}, ${getErrorMessage(
          error
        )}`,
        getErrorCode(error)
      );
    }
  }
};

/**
 * @description Delete an employee.
 * @param {string} id - The ID of the employee to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the employee with the given ID is not found.
 */
export const deleteEmployee = async (id: string): Promise<void> => {
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
