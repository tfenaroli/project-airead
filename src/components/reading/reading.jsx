/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Flex, Button, Box, Container, Divider, Heading } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import ReadingEntry from './ReadingEntry';
import Nav from '../nav/nav';
import style from './styles.module.scss';
import { getFile, makeSummaries, pushUserNote, removeUserNote, auth } from '../../services/firebase';
import Chat from '../chat/chat';

import './reading.module.scss';
import { showPDF } from '../../actions';
import chatIcon from '../../img/chat.png';
import closeIcon from '../../img/close-button.png'; // from https://www.flaticon.com/free-icon/close-button_106830

function ReadingHeader(props) {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onGenerateClick = async () => {
    try {
      setIsLoading(true);
      const token = await auth.currentUser.getIdToken();
      makeSummaries(selectedFile.id, selectedFile.chunks, token)
        .then(() => {
          toast.success('Summaries generated!');
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error generating summaries');
          setIsLoading(false);
        });
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      columnGap={1}
      mt={4}
    >
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        boxShadow="base"
      >
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Heading size="m">Your Document:</Heading>
            <Heading size="sm">{selectedFile.title}</Heading>
          </Box>
          {pdfView ? (
            <Button onClick={() => dispatch(showPDF(false))}>Hide PDF</Button>
          ) : (
            <Button onClick={() => dispatch(showPDF(true))}>Show PDF</Button>
          )}
        </Flex>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="50%"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        position="relative"
        borderRadius="l"
        boxShadow="base"
      >
        <Heading size="m">AI Summary</Heading>
        <Button
          isLoading={isLoading}
          colorScheme="pink"
          onClick={onGenerateClick}
        >
          {props.summaryExists ? 'Regenerate Summary' : 'Generate Summary'}
        </Button>
      </Flex>
    </Flex>
  );
}

function Reading(props) {
  const [isSelectedFileLoaded, setIsSelectedFileLoaded] = useState(false);
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // for font changing
  // Arial, Georgia, Courier New, Default ('')
  const [fontStyleContent, setFontStyleContent] = useState('');
  const handleFontChangeContent = (font) => {
    setFontStyleContent(font);
  };
  const [fontStyleSummary, setFontStyleSummary] = useState('');
  const handleFontChangeSummary = (font) => {
    setFontStyleSummary(font);
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

  useEffect(() => {
    if (selectedFile) {
      setIsSelectedFileLoaded(true);
    }
  }, [selectedFile]);

  const addUserNote = (noteText, chunkNum, successCallback, errorCallback) => {
    if (noteText.trim().length === 0) {
      toast('Please add text to your note');
      return;
    }
    pushUserNote(id, noteText, chunkNum, successCallback, errorCallback);
  };

  const deleteUserNote = (userNoteIndex, chunkNum, successCallback, errorCallback) => {
    removeUserNote(id, userNoteIndex, chunkNum, successCallback, errorCallback);
  };

  useEffect(() => {
    console.log(pdfView);
  }, [pdfView]);

  // eslint-disable-next-line no-shadow
  const renderChunks = (fontStyleContent, fontStyleSummary) => {
    if (isSelectedFileLoaded) {
      return selectedFile.chunks?.map((chunk, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <ReadingEntry
            chunkNum={index}
            content={chunk.content}
            summary={chunk.summary}
            userNotes={chunk.userNotes}
            summary_upToDate
            addUserNote={addUserNote}
            deleteUserNote={deleteUserNote}
            fontStyleContent={fontStyleContent}
            fontStyleSummary={fontStyleSummary}
          />
        </div>
      ));
    } else {
      return <div>Hello</div>;
    }
  };

  const toggleChatBox = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="reading-window">
      <Box minHeight="100vh" display="flex" flexDir="column">
        <Container maxWidth="none" flex={1}>
          {/* chat component */}
          {/* <Chat /> */}
          {/* header component (titles, generate summary button, etc.) */}
          <ReadingHeader />
          <Flex mb={6}>
            {/* font buttons for content (left) */}
            <Box mt={2} width="50%">
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('')}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('Arial')} style={{ fontFamily: 'Arial' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('Georgia')} style={{ fontFamily: 'Georgia' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="2xl" onClick={() => handleFontChangeContent('Courier New')} style={{ fontFamily: 'Courier New' }}>T</Button>
            </Box>
            {/* font buttons for summary (right) */}
            <Box mt={2}>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('')}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('Arial')} style={{ fontFamily: 'Arial' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('Georgia')} style={{ fontFamily: 'Georgia' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="2xl" onClick={() => handleFontChangeSummary('Courier New')} style={{ fontFamily: 'Courier New' }}>T</Button>
            </Box>
          </Flex>
          {/* pdf display */}
          {pdfView && (
            <div id={style.pdfDisplay}>
              <embed src={selectedFile.url} width="70%" height="1000" type="application/pdf" />
            </div>
          )}
          {/* reading chunks */}
          {renderChunks(fontStyleContent, fontStyleSummary)}
          {!isChatVisible ? (
            <img id={style.chatIcon} className={style.iconBorder} alt="chat icon" src={chatIcon} onClick={toggleChatBox} />
          ) : (
            <img id={style.closeIcon} alt="close icon" src={closeIcon} onClick={toggleChatBox} />
          )}
          {isChatVisible && <div id={style.chatDiv}><Chat /></div>}
        </Container>
      </Box>
    </div>
  );
}

export default function ReadingWrapper() {
  return (
    <div
      className={style.container}
    >
      <Nav />
      {/* wrapping with Chakra, stan used for frontend in this section */}
      <ChakraProvider>
        <Reading />
      </ChakraProvider>
    </div>
  );
}
