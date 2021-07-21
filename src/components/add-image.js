import { useAuth0 } from "@auth0/auth0-react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Container,
  Center,
  Heading,
  HStack,
  Link,
  Textarea,
  Spinner,
  Tag,
  TagLabel,
  Select,
  VStack,
  Tooltip,
  Box,
  List,
  Badge,
  Checkbox,
  Text,
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Loader from "./loader.js";
import { useAuthorizedFetcher } from "../utils/backend.js";

export default function AddImage(props) {
  const cragId = props.match.params.cragId;
  const sectorId = props.match.params.sectorId;
  const history = useHistory();
  const { authorizedFetcher, isAuthenticated, isLoading, error } = useAuthorizedFetcher();

  const addImage = (base64Image) =>
    authorizedFetcher("/images", {
      method: "POST",
      body: JSON.stringify({
        sector_id: sectorId,
        base64_image: base64Image,
      }),
    });

  const navigateToSector = () =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}`);

  const navigateToAddedImage = (imageId) =>
    history.replace(`/crags/${cragId}/sectors/${sectorId}/images/${imageId}`);

  const onDropImages = (files) => {
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onabort = () => reject("File reading was aborted");
          reader.onerror = () => reject("File reading has failed");
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }).then(addImage)
      )
    )
      .then((images) =>
        images.length >= 2
          ? navigateToSector()
          : navigateToAddedImage(images[0].id)
      )
      .catch(console.error);
  };

  if (error) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">Failed to load auth token.</Text>
        </Center>
      </Container>
    );
  }

  if (!authorizedFetcher && !isLoading) {
    return (
      <Container maxWidth="container.md">
        <Center>
          <Text margin="20px">You need to login to add stuff and vote.</Text>
        </Center>
      </Container>
    );
  }

  if (!authorizedFetcher && isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Container maxWidth="container.md">
      <Heading>Add image</Heading>
      <Dropzone accept={["image/jpeg"]} onDrop={onDropImages}>
        {({ getRootProps, getInputProps }) => (
          <Box
            border="1px dashed"
            borderColor="brand.200"
            padding="20px"
            marginTop="10px"
          >
            <Center {...getRootProps()}>
              <input {...getInputProps()} />
              <Text>
                Drag and drop images here or click to select (only jpeg allowed)
              </Text>
            </Center>
          </Box>
        )}
      </Dropzone>
    </Container>
  );
}
