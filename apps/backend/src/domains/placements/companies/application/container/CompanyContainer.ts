import { CompanyRepository } from "../../infrastructure/repositories/CompanyRepository.js";

import { CreateCompanyUseCase } from "../use-cases/CreateCompanyUseCase.js";
import { GetCompanyUseCase } from "../use-cases/GetCompanyUseCase.js";
import { GetCompaniesUseCase } from "../use-cases/GetCompaniesUseCase.js";
import { UpdateCompanyUseCase } from "../use-cases/UpdateCompanyUseCase.js";
import { UpdateCompanyStatusUseCase } from "../use-cases/UpdateCompanyStatusUseCase.js";
import { DeleteCompanyUseCase } from "../use-cases/DeleteCompanyUseCase.js";

const companyRepository = new CompanyRepository();

export const companyContainer = {

    createCompany:

        new CreateCompanyUseCase(
            companyRepository
        ),

    getCompany:

        new GetCompanyUseCase(
            companyRepository
        ),

    getCompanies:

        new GetCompaniesUseCase(
            companyRepository
        ),

    updateCompany:

        new UpdateCompanyUseCase(
            companyRepository
        ),

    updateCompanyStatus:

        new UpdateCompanyStatusUseCase(
            companyRepository
        ),

    deleteCompany:

        new DeleteCompanyUseCase(
            companyRepository
        )

};
