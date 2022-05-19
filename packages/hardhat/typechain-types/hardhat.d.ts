/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "LinkTokenInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LinkTokenInterface__factory>;
    getContractFactory(
      name: "VRFConsumerBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VRFConsumerBase__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155__factory>;
    getContractFactory(
      name: "IERC1155MetadataURI",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155MetadataURI__factory>;
    getContractFactory(
      name: "IERC1155",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "ERC721Enumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Enumerable__factory>;
    getContractFactory(
      name: "ERC721URIStorage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721URIStorage__factory>;
    getContractFactory(
      name: "IERC721Enumerable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Enumerable__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "AdventurerBadgeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AdventurerBadgeFactory__factory>;
    getContractFactory(
      name: "AdventurerNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AdventurerNFT__factory>;
    getContractFactory(
      name: "AppDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AppDiamond__factory>;
    getContractFactory(
      name: "BadgeNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BadgeNFT__factory>;
    getContractFactory(
      name: "ERC1155BaseInternal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1155BaseInternal__factory>;
    getContractFactory(
      name: "BadgeFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BadgeFacet__factory>;
    getContractFactory(
      name: "DiamondCutFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondCutFacet__factory>;
    getContractFactory(
      name: "DiamondLoupeFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondLoupeFacet__factory>;
    getContractFactory(
      name: "OwnershipFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnershipFacet__factory>;
    getContractFactory(
      name: "IAdventureMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAdventureMetadata__factory>;
    getContractFactory(
      name: "IAdventurerBadgeFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAdventurerBadgeFactory__factory>;
    getContractFactory(
      name: "IAdventurerNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAdventurerNFT__factory>;
    getContractFactory(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondCut__factory>;
    getContractFactory(
      name: "IDiamondLoupe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondLoupe__factory>;
    getContractFactory(
      name: "IERC1155Internal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Internal__factory>;
    getContractFactory(
      name: "IERC173",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC173__factory>;
    getContractFactory(
      name: "LibBadge",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibBadge__factory>;
    getContractFactory(
      name: "LibDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibDiamond__factory>;
    getContractFactory(
      name: "Migrations",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Migrations__factory>;
    getContractFactory(
      name: "NFTAux",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NFTAux__factory>;
    getContractFactory(
      name: "PathwayNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PathwayNFT__factory>;
    getContractFactory(
      name: "ProjectDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProjectDiamond__factory>;
    getContractFactory(
      name: "ProjectNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProjectNFT__factory>;
    getContractFactory(
      name: "RandomNumberConsumer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RandomNumberConsumer__factory>;
    getContractFactory(
      name: "SponsorPassSFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SponsorPassSFT__factory>;
    getContractFactory(
      name: "DiamondInit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondInit__factory>;
    getContractFactory(
      name: "Verify",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Verify__factory>;

    getContractAt(
      name: "LinkTokenInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LinkTokenInterface>;
    getContractAt(
      name: "VRFConsumerBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VRFConsumerBase>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155>;
    getContractAt(
      name: "IERC1155MetadataURI",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155MetadataURI>;
    getContractAt(
      name: "IERC1155",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "ERC721Enumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Enumerable>;
    getContractAt(
      name: "ERC721URIStorage",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721URIStorage>;
    getContractAt(
      name: "IERC721Enumerable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Enumerable>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "AdventurerBadgeFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AdventurerBadgeFactory>;
    getContractAt(
      name: "AdventurerNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AdventurerNFT>;
    getContractAt(
      name: "AppDiamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AppDiamond>;
    getContractAt(
      name: "BadgeNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BadgeNFT>;
    getContractAt(
      name: "ERC1155BaseInternal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1155BaseInternal>;
    getContractAt(
      name: "BadgeFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BadgeFacet>;
    getContractAt(
      name: "DiamondCutFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondCutFacet>;
    getContractAt(
      name: "DiamondLoupeFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondLoupeFacet>;
    getContractAt(
      name: "OwnershipFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnershipFacet>;
    getContractAt(
      name: "IAdventureMetadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAdventureMetadata>;
    getContractAt(
      name: "IAdventurerBadgeFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAdventurerBadgeFactory>;
    getContractAt(
      name: "IAdventurerNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAdventurerNFT>;
    getContractAt(
      name: "IDiamondCut",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondCut>;
    getContractAt(
      name: "IDiamondLoupe",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondLoupe>;
    getContractAt(
      name: "IERC1155Internal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Internal>;
    getContractAt(
      name: "IERC173",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC173>;
    getContractAt(
      name: "LibBadge",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LibBadge>;
    getContractAt(
      name: "LibDiamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LibDiamond>;
    getContractAt(
      name: "Migrations",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Migrations>;
    getContractAt(
      name: "NFTAux",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NFTAux>;
    getContractAt(
      name: "PathwayNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PathwayNFT>;
    getContractAt(
      name: "ProjectDiamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProjectDiamond>;
    getContractAt(
      name: "ProjectNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProjectNFT>;
    getContractAt(
      name: "RandomNumberConsumer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RandomNumberConsumer>;
    getContractAt(
      name: "SponsorPassSFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SponsorPassSFT>;
    getContractAt(
      name: "DiamondInit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondInit>;
    getContractAt(
      name: "Verify",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Verify>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
