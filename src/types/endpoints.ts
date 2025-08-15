export interface Endpoint {
  id: number;
  name: string;
  description: string;
  version: string;
  creationTs: string;
  sourceType: string;
  clazz: string;
  url: string;
  resultType: string;
  requestParameters: EndpointRequestParameter[];
  responsePaths: EndpointResponsePath[];
}

export interface EndpointRequestParameter {
  id: number;
  name: string;
  type: string;
  description: string;
  creationTs: string;
  endpointId: number;
}

export interface EndpointResponsePath {
  id: number;
  path: string;
  creationTs: string;
  endpointId: number;
}
