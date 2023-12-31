import cohere
import time

import os
from pathlib import Path
from dotenv import load_dotenv
import json


dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)

MODEL = os.getenv('MODEL')
f = open(MODEL)
MODEL_DICT = json.load(f)
f.close()

class CoHere:
    def __init__(self, api_key):
        if api_key is not None:
            self.co = cohere.Client(f'{api_key}')
        self.models = MODEL_DICT

    def get_models(self):
        return list(self.models.keys())

    def add_bot_text(self, text):
        return 'Cohere: ' + text

    def add_human_text(self, text):
        return 'You: ' + text

    def clean_text(self, text):
        return text.strip()

    def cut_answer(self, text):
        index = text.find('You:')
        if index != -1:
            return text[:index]
        else:
            return text

    def count_token(self, text):
        return len(self.co.tokenize(text=text))
    
    def is_exceed_max_tokens(self, model, prompt, max_tokens):
        return self.count_token(prompt) + max_tokens >= model['model_max_tokens']

    def asked(self, conv_dict, model, key, temp=0, max_tokens=500):

        if model in list(self.models.keys()) and key["key"] in list(self.models[model]["model_id"].keys()):
            #Copy the settings of the model
            model = self.models[model].copy()

            # Change model id for specific api key.
            model['model_id'] = model["model_id"][key["key"]]
        else: 
            #Copy the settings of the model
            model = self.models['command-nightly'].copy()
            # Change model id for specific api key.
            model['model_id'] = 'command-nightly'

        print(model['model_id'])

        conv_list = list(conv_dict.values())

        prompt = ('\n'.join(conv_list) + '\nCohere:')

        summarized = False
        
        if self.is_exceed_max_tokens(model, prompt, max_tokens):
            summarized = True

            back_size = (int)(len(conv_list)/7)
            if back_size % 2 == 0:
                back_size += 1
            if back_size < 3:
                back_size = 3

            c_list = conv_list[:-back_size]
            summary_list = []
            for i in range(len(c_list)):
                if 'Cohere:' in c_list[i]:
                    summary_list.append(c_list[i])
            for i in range(len(summary_list)):
                summary_list[i] = summary_list[i].replace('Cohere:','')

            summary_text = self.summarize('\n'.join(summary_list), temp=0).summary
            summary_text = self.add_bot_text(self.clean_text(summary_text))

            conv_list = [summary_text] + conv_list[-back_size:]

            prompt = ('\n'.join(conv_list) + '\nCohere:')


        answer = self.co.generate(
              model=model["model_id"],
              prompt=prompt,
              max_tokens=max_tokens,
              temperature=temp).generations[0].text
        answer_time = time.ctime(time.time())
        
        answer = self.cut_answer(answer)
        answer = self.clean_text(answer)
        if len(answer) == 0:
            answer = "Cohere cannot answer this question"
             
        conv_list.append(self.add_bot_text(answer))

        return summarized, conv_list, answer, answer_time
    
    def summarize(self, conserv, temp=0, command=''):
        return self.co.summarize(text=conserv,
                                 format='paragraph',
                                 temperature=temp,
                                 additional_command=command)
    