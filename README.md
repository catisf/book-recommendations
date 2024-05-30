# book-recommendations
Project 4 of UoB Data Analytics bootcamp - Machine Learning

## Contents:
1. [Overview](https://github.com/catisf/book-recommendations/blob/main/README.md#1-overview)
2. [Project development](https://github.com/catisf/book-recommendations/blob/main/README.md#2-project-development)
3. [Conclusions](https://github.com/catisf/book-recommendations/blob/main/README.md#3-conclusions)
4. [Using this repository](https://github.com/catisf/book-recommendations/blob/main/README.md#4-using-this-repository)
5. [Data source](https://github.com/catisf/book-recommendations/blob/main/README.md#5-data-source)
6. [Code source](https://github.com/catisf/book-recommendations/blob/main/README.md#6-code-source)
7. [Team](https://github.com/catisf/book-recommendations/blob/main/README.md#7-team)

## 1. Overview:
> **"I declare after all there is no enjoyment like reading! How much sooner one tires of any thing than of a book!"** - Jane Austen, Pride and Prejudice

Books transport us to different places and lives, and as any avid reader will know, it can be hard to recover from that feeling of emptiness one can get after finishing a really good book. One can feel slightly lost and not know where to go next. 

With this in mind, the main goal of this project was to create a book recommendation system so that no reader needs to feel this way again! 

We used an existing dataset with information on over 6000 books and used unsupervised learning to cluster those books that share similar features. We then developed a practical application of the clustering algorithm, using a combination of HTML, CSS and JavaScript to create a book recommendation website, where users select one of the displayed books and are recommended other similar books. 

## 2. Project development 
### 2.1 Data fetching and cleaning
- Data was sourced from [kaggle](https://www.kaggle.com/). We used an available dataset, containing information about over 6000 books. The dataset contained information such as the books' titles, author, published year, average ratings, etc. 
- Using jupyter notebooks, we cleaned the data (e.g., eliminated empty and duplicated rows), and analysed the data more closely, to better understand the dataset at hand. The file used for this step can be found [here](https://github.com/catisf/book-recommendations/blob/main/jupyter_notebooks/cleaning_data.ipynb).

### 2.2 Clustering (K-means) model 
- The cleaned data was imported into a new jupyter notebook and prepared before running the clustering model. Data preparation included dropping unecessary columns, one-hot encoding categorical variables and scaling numerical variables.
- Using the elbow and silhouette methods, the best value of K was determined and a KMeans model was run, using the [scikit-learn](https://scikit-learn.org/stable/) library for python. The model was evaluated by calculating the [Calinski-Harabasz Index](https://scikit-learn.org/stable/modules/clustering.html#calinski-harabasz-index). 
- The file used for these steps can be found [here](https://github.com/catisf/book-recommendations/blob/main/jupyter_notebooks/clustering_model.ipynb).

### 2.3 Model optimisation
- In order to optimise the model, different we tried different approaches. These included: 
    - decompose the data into principal components (PCA)
    - drop authors
    - drop book categories
    - filtering and binning published year
    - drop 2 outlier books
- The file used for these steps can be found [here](https://github.com/catisf/book-recommendations/blob/main/jupyter_notebooks/model_optimisation.ipynb) and [here](https://github.com/catisf/book-recommendations/blob/main/jupyter_notebooks/model_optimisation_no_outliers.ipynb).

### 2.4 Website
- Using SQLite a database was created to serve an API with the best performing model. 
- Using Flask we set up one API route to serve the data.
- Using a combination of combination of HTML, CSS and JavaScript, we created a book recommendation website. The website displays several books for the user to select. Once the user selects a book, JavaScript calculates the 5 closest books (in Euclidean distance) in the same cluster of the chosen book and displays 5 recommendations.

## 3. Conclusions:
For this project, we relied on a highly complex dataset which - after one-hot-encoding - included nearly 5000 features. 

This created some limitations in our model and, in fact, the best performing model did not include information on book authors. This is likely because dropping that information drastically reduced the number of features used. Whilst dropping author information did lead to a higher Calinski-Harabasz Index, we believe that information would have been important when recommending books. 

So whilst we acknowledge that the model used in our recommendation system has some limitations and could be improved (e.g., a more appropriate dataset which could include data from several users), we have successfully utilised an unsupervised learning algorithm to cluster books with shared features and created a book recommendation system, so that no reader needs to ever feel lost again after finishing a book.

## 4. Using this repository:
1. Clone the repository to your local computer. In your Terminal, type `git clone https://github.com/catisf/book-recommendations.git`
2. If you want to review/run our data cleaning, clustering model or model optimisation, you can find all of the jupyter notebooks used (with notes) in the [`jupyter_notebooks` folder](https://github.com/catisf/book-recommendations/tree/main/jupyter_notebooks)
3. If you want to access the website, navigate to the `website` folder on your terminal and type `python app.py`. 

## 5. Data source:
- Book data was sourced from the following dataset on Kaggle: https://www.kaggle.com/datasets/abdallahwagih/books-dataset

## 6. Code source:
Parts of our code were adapted from the documentation of the libraries used, including:
- Silhouette analysis: https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html
- Calinski-Harabasz Index: https://scikit-learn.org/stable/modules/clustering.html#calinski-harabasz-index


## 7. Team:
The following authors worked collaboratively on this project:
- [Ammarah Ahmad](https://github.com/Amarah010)
- [Catarina Ferreira](https://github.com/catisf)
- [Kashfi Khalid](https://github.com/kashfi-khalid)
- [Sadek Ahmed](https://github.com/Sadek-Ahmed16)




