// eslint-disable-next-line max-len
import AssociationSchemaDefinitionSchema from './associations/AssociationSchemaDefinitionSchema.dto';
import AssociationsListSchema from './associations/AssociationsListSchema.dto';
import ObjectAssociationSchema, {
  AssociationSpecSchema,
} from './associations/ObjectAssociationSchema.dto';
import HubspotCompanyCreateDto from './companies/HubspotCompanyCreate.dto';
import HubspotCompanySearchDto, {
  HubspotCompanySearchV2Dto as HubspotCompanySearchV2Dto,
} from './companies/HubspotCompanySearch.dto';
import HubspotCompanyUpdateDto from './companies/HubspotCompanyUpdate.dto';
import HubspotContactCreateDto from './contacts/HubspotContactCreate.dto';
import HubspotContactSearchDto, {
  HubspotContactSearchV2Dto as HubspotContactSearchV2Dto,
} from './contacts/HubspotContactSearch.dto';
import HubspotContactUpdateDto from './contacts/HubspotContactUpdate.dto';
import HubspotDealCreateDto from './deals/HubspotDealCreate.dto';
import HubspotDealUpdateDto, {
  HubspotDealUpdateV2Dto,
} from './deals/HubspotDealUpdate.dto';
import HubspotDealSearchDto, {
  HubspotDealSearchV2Dto,
} from './deals/HubspotDeatSearch.dto';
import BatchCreateObjectsSchema, {
  AssociationTypeSchema,
  AssociationSchema,
  ObjectInputSchema,
} from './objects/BatchCreateObjectsSchema.dto';
import BatchReadObjectsSchema, {
  ObjectReadInputSchema,
} from './objects/BatchReadObjectSchema.dto';
import BatchUpdateObjectsSchema, {
  PropertiesSchema,
  ObjectUpdateInputSchema,
} from './objects/BatchUpdateObjectSchema.dto';
import ObjectListSchema from './objects/ObjectListSchema.dto';
import ObjectSearchSchema, {
  OperatorEnum,
  FilterSchema,
  FilterGroupSchema,
  SortSchema,
} from './objects/ObjectSearchSchema.dto';
import SchemaInfoSchema from './objects/SchemaInfoSchema.dto';
import HubspotPipelineSearchDto, {
  HubspotPipelineSearchV2Dto,
} from './pipelines/HubspotPipelineSearch.dto';
import HubspotStageSearchDto, {
  HubspotStageSearchV2Dto,
} from './pipelines/stages/HubspotStageSearch.dto';
import HubspotProductSearchDto, {
  HubspotProductSearchV2Dto,
} from './products/HubspotProductSearch.dto';

export {
  AssociationSchemaDefinitionSchema,
  AssociationSpecSchema,
  AssociationsListSchema,
  BatchReadObjectsSchema,
  BatchUpdateObjectsSchema,
  ObjectUpdateInputSchema,
  FilterGroupSchema,
  FilterSchema,
  BatchCreateObjectsSchema,
  AssociationTypeSchema,
  AssociationSchema,
  ObjectInputSchema,
  HubspotCompanyCreateDto,
  HubspotCompanySearchDto,
  HubspotCompanySearchV2Dto,
  HubspotCompanyUpdateDto,
  HubspotContactCreateDto,
  HubspotContactSearchDto,
  HubspotContactSearchV2Dto,
  HubspotContactUpdateDto,
  HubspotDealCreateDto,
  HubspotDealSearchDto,
  HubspotDealSearchV2Dto,
  HubspotDealUpdateDto,
  HubspotDealUpdateV2Dto,
  HubspotPipelineSearchDto,
  HubspotPipelineSearchV2Dto,
  HubspotProductSearchDto,
  HubspotProductSearchV2Dto,
  HubspotStageSearchDto,
  HubspotStageSearchV2Dto,
  ObjectAssociationSchema,
  ObjectListSchema,
  ObjectReadInputSchema,
  ObjectSearchSchema,
  OperatorEnum,
  PropertiesSchema,
  SchemaInfoSchema,
  SortSchema,
};
