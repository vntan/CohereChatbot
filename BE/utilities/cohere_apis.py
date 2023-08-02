import cohere
import time

class CoHere:
    def __init__(self, api_key):
        self.co = cohere.Client(f'{api_key}')

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

    def asked(self, model, conv_dict, max_tokens=500, temp=0):
        conv_list = list(conv_dict.values())

        prompt = ('\n'.join(conv_list) + '\nCohere:')

        summarized = False
        
        if self.count_token(prompt) > 3200:
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

        try: 
            print(f'Cohere model: {model}')
            answer = self.co.generate(
                model=model,
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temp).generations[0].text
        except Exception as error:
            print(error)
            if 'model not found' in str(error):
                print(f'Replace cohere model: command-nightly')
                answer = self.co.generate(
                    model='command-nightly',
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temp).generations[0].text
            else:
                raise Exception(error)
            
        answer = self.cut_answer(answer)
        if len(answer) == 0:
            answer = "Cannot find your answer right now!"


        answer_time = time.ctime(time.time())

        
        conv_list.append(self.add_bot_text(self.clean_text(answer)))

        return summarized, conv_list, self.clean_text(answer), answer_time
    
    def summarize(self, conserv, temp=0, command=''):
        return self.co.summarize(text=conserv,
                                 format='paragraph',
                                 temperature=temp,
                                 additional_command=command)
    